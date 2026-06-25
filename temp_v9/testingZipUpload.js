const zipUploadInput = document.getElementById("zipUploadInput")



zipUploadInput.addEventListener("change", () => console.log("Changed!"))


let igDataLatest = 0
let instaUploadLatestTimestamp = 0
let instaUploadedList = []
const connections = []

const userRelationshipsLibrary = [
	{
		relationship: "blocked",
		files: ["blocked_accounts.json", "blocked_profiles.json"]
	},
	{
		relationship: "close_friend",
		files: ["close_friends.json"]
	},
	{
		relationship: "feed_favorite",
		files: ["accounts_you've_favorited.json", "profiles_you've_favorited.json"]
	},
	{
		relationship: "follow_request_pending",
		files: ["pending_follow_requests.json"]
	},
	{
		relationship: "follow_request_received",
		files: ["follow_requests_you've_received.json"]
	},
	{
		relationship: "follow_request_recent",
		files: ["recent_follow_requests.json"]
	},
	{
		relationship: "follower",
		files: ["followers_1.json"]
	},
	{
		relationship: "following",
		files: ["following.json"]
	},
	{
		relationship: "restricted",
		files: ["restricted_accounts.json", "restricted_profiles.json"]
	},
	{
		relationship: "stories_hidden",
		files: ["hide_story_from.json"]
	},
	{
		relationship: "unfollowed_by_you",
		files: ["recently_unfollowed_accounts.json", "recently_unfollowed_profiles.json"]
	},
	{
		relationship: "unfollowed_you",
		files: []
	},
	
]


async function loadZIP() {
	const zipFileReader = new zip.ZipReader(new zip.BlobReader(zipUploadInput.files[0]))

	const entries = await zipFileReader.getEntries()

	instaUploadLatestTimestamp = Date.parse(entries[0].lastModDate)

	const files = filterRelevantFiles(entries)

	const usersData = await loadDataFromFiles(files)

	instaUploadedList = applyUsersRelationships(usersData)


	return instaUploadedList
}

function filterRelevantFiles(entries) {
	
	const allFiles = entries.filter(entry => entry.directory == false)
	

	const relevantFiles = allFiles.filter(file => file.filename.startsWith("connections/followers_and_following/"))
	
	
	console.groupCollapsed("Filtering Relevant Files")
	console.info("# Entries: ", entries.length)
	console.info("# Dirs removed: ", entries.length - allFiles.length)
	console.info("# Files removed: ", allFiles.length - relevantFiles.length)
	console.info("# Relevant Files left: ", relevantFiles.length)
	console.groupEnd("Filtering Relevant Files");
	
	return relevantFiles
}

async function loadDataFromFiles(zipEntriesFiles) {

	const allUserInfo = await Promise.all(zipEntriesFiles.map(file => loadUserInfo(file)))
	console.log(allUserInfo.filter(userInfo => userInfo != null))
	const relevantUserInfo = allUserInfo.filter(userInfo => userInfo != null)
										.flat()
										.sort((a,b) => b.timestamp - a.timestamp)

	return relevantUserInfo
}

async function loadJSONFile(zipEntryFile) {

	const fileWriter = new zip.TextWriter()
	const fileText = await zipEntryFile.getData(fileWriter)
	const fileJson = JSON.parse(fileText)

	return fileJson
}

async function loadUserInfo(zipEntryFile) {

	const fileMatchRelationship = (file) => zipEntryFile.filename.includes(file)
	const libraryMatch = userRelationshipsLibrary.find(rel => rel.files.some(fileMatchRelationship))

	if(libraryMatch != null) {
		const fileJSON = await loadJSONFile(zipEntryFile)
		const userInfo = extractAllUserInfo(fileJSON, libraryMatch.relationship)

		return userInfo
	}
}

function extractAllUserInfo(data, relationship) {

	do {
		if(Object.keys(data).length == 1) {
			data = Object.values(data)[0]
		}
	} while(!Array.isArray(data))
	
	const allExtractedInfo = data.map(singleUserData => extractSingleUserInfo(singleUserData, relationship))
								 

	return allExtractedInfo
}

function extractSingleUserInfo(data, relationship) {
	const extractedInfo = {
		username: undefined,
		timestamp: undefined,
		relationship
	}

	if(Array.isArray(data?.string_list_data)) {
		const string_list_data = data.string_list_data[0]

		extractedInfo.username = string_list_data?.value ? string_list_data.value : data.title
		extractedInfo.timestamp = string_list_data.timestamp * 1000
	}

	if(Array.isArray(data?.label_values)) {
		const label_values = data.label_values
		
		extractedInfo.username = label_values.find(label_value => label_value.label == "Username").value
		extractedInfo.timestamp = data.timestamp * 1000
	}

	if(extractedInfo.username != null & extractedInfo.timestamp != null) {
		return extractedInfo
	} else {
		return
	}
}

function applyUsersRelationships(usersData) {
	usersData.forEach(data => {
		setUserRelationship(data.username, data.relationship, data.timestamp)
	}); 

	return connections
}




function getUserIndex(_name) {
	const userIndex = connections.findIndex((user) => user.name === _name)

	if(userIndex === -1) {
		const newUser = createNewUser(_name)
		connections.push(newUser)
		const newUserIndex = getUserIndex(_name)
		return newUserIndex
	} else {
		return userIndex
	}

}

function setUserRelationship(_name, _relationship, _timestamp) {
	const userIndex = getUserIndex(_name)
	const historyLog = {
		updated: _relationship,
		value: true,
		timestamp: _timestamp
	}
	if(!connections[userIndex].relationship[_relationship]){
		connections[userIndex].relationship[_relationship] = true
	}

	connections[userIndex].addHistoryLog(_relationship, true, _timestamp )
	igDataLatest = igDataLatest < _timestamp ? _timestamp : igDataLatest
}

function createNewUser(_name) {
	// const newElement = getUserTemplate(_name)
	const myNewUser = {
		name: _name,
		relationship: {
			following: false,
			follower: false,
			feed_favorite: false,
			blocked: false,
			close_friend: false,
			stories_hidden: false,
			follow_request_pending: false,
			follow_request_received: false,
			follow_request_recent: false,
			unfollowed_by_you: false,
			unfollowed_you: false,
			restricted: false,
		},
		timestamp: {
			latest: 0
		},
		// elements,
		history: [],

		addHistoryLog(_updated, _value, _timestamp){
			const filterHistory = this.history.filter((log) => log.updated == _updated && log.value == _value && log.timestamp * 1 == _timestamp * 1)
			if(filterHistory.length < 1) {
				this.history.push({
					updated: _updated,
					value: _value,
					timestamp: _timestamp
				})
				this.history.sort((a, b) => a.timestamp - b.timestamp)
			}
		}
	}

	return myNewUser
}