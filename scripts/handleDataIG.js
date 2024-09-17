
const {configure, BlobReader, BlobWriter, TextReader, TextWriter, ZipReader, ZipWriter} = zip;

const inputEl = document.getElementById("inputZIP")
// inputEl.addEventListener("change", loadZIP)

let entries;
let instaUploadLatestTimestamp = 0 
let instaUploadedList = []

async function loadZIP() {
	const zipFileReader = new BlobReader(this.files[0])
	const zipReader = new ZipReader(zipFileReader);
	entries = await zipReader.getEntries({})
	loadFiles()
}

const loadFiles = async function() {
	let itemsProcessed = 0
	entries.forEach(async (file) => {
		if(file.filename.startsWith("connections/followers_and_following/") && !file.directory) {
			const fileWriter = new TextWriter()
			const fileText = await file.getData(fileWriter)
			const fileJson = JSON.parse(fileText)
			
			
			// Favoritd accounts <i class="fa-solid fa-star"></i>
			if(file.filename === "connections/followers_and_following/accounts_you've_favorited.json" || file.filename === "connections/followers_and_following/profiles_you've_favorited.json") {
				fileJson["relationships_feed_favorites"].forEach((user) => {
					const newName = user.string_list_data[0].value
					const newTimestamp = user.string_list_data[0].timestamp * 1000

					instaUploadLatestTimestamp = instaUploadLatestTimestamp < newTimestamp ? newTimestamp : instaUploadLatestTimestamp

					setUserRelationship(newName, "feed_favorite", newTimestamp)
				});
			}
			// Blocked Accounts <i class="fa-solid fa-user-large-slash"></i>
			if(file.filename === "connections/followers_and_following/blocked_accounts.json" || file.filename === "connections/followers_and_following/blocked_profiles.json") {
				fileJson["relationships_blocked_users"].forEach((user) => {
					const newName = user.title
					const newTimestamp = user.string_list_data[0].timestamp * 1000

					instaUploadLatestTimestamp = instaUploadLatestTimestamp < newTimestamp ? newTimestamp : instaUploadLatestTimestamp

					setUserRelationship(newName, "blocked", newTimestamp)
				});
			}
			// Close Friends <i class="fa-solid fa-circle-user"></i>
			if(file.filename === "connections/followers_and_following/close_friends.json") {
				fileJson["relationships_close_friends"].forEach((user) => {
					const newName = user.string_list_data[0].value
					const newTimestamp = user.string_list_data[0].timestamp * 1000

					instaUploadLatestTimestamp = instaUploadLatestTimestamp < newTimestamp ? newTimestamp : instaUploadLatestTimestamp

					setUserRelationship(newName, "close_friend", newTimestamp)
				});
			}
			// follow_requests_received <i class="fa-solid fa-person-circle-exclamation"></i>
			if(file.filename === "connections/followers_and_following/follow_requests_you've_received.json") {
				fileJson["relationships_follow_requests_received"].forEach((user) => {
					const newName = user.string_list_data[0].value
					const newTimestamp = user.string_list_data[0].timestamp * 1000

					instaUploadLatestTimestamp = instaUploadLatestTimestamp < newTimestamp ? newTimestamp : instaUploadLatestTimestamp

					setUserRelationship(newName, "follow_request_received", newTimestamp)
				});
			}

			// Followers <i class="fa-solid fa-person-arrow-down-to-line"></i>
			if(file.filename.startsWith("connections/followers_and_following/followers_")) {
				fileJson.forEach((user) => {
					const newName = user.string_list_data[0].value
					const newTimestamp = user.string_list_data[0].timestamp * 1000

					instaUploadLatestTimestamp = instaUploadLatestTimestamp < newTimestamp ? newTimestamp : instaUploadLatestTimestamp

					setUserRelationship(newName, "follower", newTimestamp)
				});
			}

			// following <i class="fa-solid fa-person-arrow-up-from-line"></i>
			if(file.filename === "connections/followers_and_following/following.json") {
				fileJson["relationships_following"].forEach((user) => {
					const newName = user.string_list_data[0].value
					const newTimestamp = user.string_list_data[0].timestamp * 1000

					instaUploadLatestTimestamp = instaUploadLatestTimestamp < newTimestamp ? newTimestamp : instaUploadLatestTimestamp

					setUserRelationship(newName, "following", newTimestamp)
				});
			}

			// hide story <i class="fa-solid fa-eye-slash"></i>
			if(file.filename === "connections/followers_and_following/hide_story_from.json") {
				fileJson["relationships_hide_stories_from"].forEach((user) => {
					const newName = user.string_list_data[0].value
					const newTimestamp = user.string_list_data[0].timestamp * 1000

					instaUploadLatestTimestamp = instaUploadLatestTimestamp < newTimestamp ? newTimestamp : instaUploadLatestTimestamp

					setUserRelationship(newName, "stories_hidden", newTimestamp)
				});
			}

			// pending_follow_requests <i class="fa-solid fa-person-circle-question"></i>
			if(file.filename === "connections/followers_and_following/pending_follow_requests.json") {
				fileJson["relationships_follow_requests_sent"].forEach((user) => {
					const newName = user.string_list_data[0].value
					const newTimestamp = user.string_list_data[0].timestamp * 1000

					instaUploadLatestTimestamp = instaUploadLatestTimestamp < newTimestamp ? newTimestamp : instaUploadLatestTimestamp

					setUserRelationship(newName, "follow_request_pending", newTimestamp)
				});
			}

			// // recent_follow_requests  <i class="fa-solid fa-user-shield"></i> <i class="fa-solid fa-user-gear"></i>
			// if(file.filename === "connections/followers_and_following/recent_follow_requests.json") {
			// 	fileJson["relationships_permanent_follow_requests"].forEach((user) => {
			// 		const newName = user.string_list_data[0].value
			// 		const newTimestamp = user.string_list_data[0].timestamp * 1000

			// 		instaUploadLatestTimestamp = instaUploadLatestTimestamp < newTimestamp ? newTimestamp : instaUploadLatestTimestamp

			// 		setUserRelationship(newName, "follow_request_recent", newTimestamp)
			// 	});
			// }

			// recently_unfollowed_accounts <i class="fa-solid fa-user-minus"></i>
			if(file.filename === "connections/followers_and_following/recently_unfollowed_accounts.json" || file.filename === "connections/followers_and_following/recently_unfollowed_profiles.json") {
				fileJson["relationships_unfollowed_users"].forEach((user) => {
					const newName = user.string_list_data[0].value
					const newTimestamp = user.string_list_data[0].timestamp * 1000

					instaUploadLatestTimestamp = instaUploadLatestTimestamp < newTimestamp ? newTimestamp : instaUploadLatestTimestamp

					setUserRelationship(newName, "unfollowed_by_you", newTimestamp)
				});
			}
			// restricted_users <i class="fa-solid fa-user-lock"></i>
			if(file.filename === "connections/followers_and_following/restricted_accounts.json" || file.filename === "connections/followers_and_following/restricted_profiles.json") {
				fileJson["relationships_restricted_users"].forEach((user) => {
					const newName = user.string_list_data[0].value
					const newTimestamp = user.string_list_data[0].timestamp * 1000

					instaUploadLatestTimestamp = instaUploadLatestTimestamp < newTimestamp ? newTimestamp : instaUploadLatestTimestamp

					setUserRelationship(newName, "restricted", newTimestamp)
				});
			}
		}
		itemsProcessed++
		if(itemsProcessed === entries.length){
			console.log("done")
			connections.sort((a, b) => b.history[b.history.length-1].timestamp *1 - a.history[a.history.length-1].timestamp *1)
			instaUploadedList = connections
			// ORder list
			// connections.sort((a, b) => b.timestamp.latest - a.timestamp.latest)
			// Load dom elements for each user
			// renderConnectionsList(connections)
			// OptionsDOM()
			// setDataSessionButton(connections)
		}
	})
	return connections
}

const connections = []


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