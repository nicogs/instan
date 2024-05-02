const navDownloadSession = document.getElementById("navDownloadSession")
navDownloadSession.addEventListener("click", saveSessionFromLocalStorageToJSON)
const navDeleteSession = document.getElementById("navDeleteSession")
navDeleteSession.addEventListener("click", handleDeleteSession)

function setDataSessionButton(_data) {
	const newestTimestamp = new Date(1705362981000)
	const data = JSON.stringify(connections)

	const fileName = "_ " + newestTimestamp.getFullYear() + "_" + newestTimestamp.getMonth()+1 + "_" + newestTimestamp.getDate() + " session_followerInstanalytics.json"
	downloadFile(data, fileName, "application/json")
}

let sessionUploadLatestTimestamp = 0 
let sessionUploadedList = []
let sessionUploaded

// const inputSession = document.getElementById("inputSession")
let connectionsPreviousSession
let connectionsPreviousSessionStats
let connectionsPrevious
const connectionsDifference = []

// inputSession.addEventListener("change", loadSession)

function loadSession() {
	const reader = new FileReader()
	reader.addEventListener('load', function() {
		var result = JSON.parse(reader.result); // Parse the result into an object 
		sessionUploaded = result
		connectionsPreviousSession = result.connections
		connectionsPreviousSessionStats = result.stats
		// if(connections.length > 0) compareUsers(connections, connectionsPreviousSession)
		sessionUploadedList = result.connections
		sessionUploadLatestTimestamp = result.stats[result.stats.length-1].timestamp * 1
		// const currentSessionData = createSessionData(connectionsPreviousSession, connectionsPreviousSessionStats)
		// saveSessionToLocalStorage(currentSessionData)
		console.log(result);
	})
	reader.readAsText(this.files[0])
}

function compareUsers(_connectionsCurrentSession, _connectionsPreviousSession) {
	_connectionsPreviousSession.forEach((user) => {
		compareUser(user.name, _connectionsCurrentSession, _connectionsPreviousSession)
	})
	_connectionsCurrentSession.forEach((user) => {
		compareUser(user.name, _connectionsCurrentSession, _connectionsPreviousSession)
	})
}

function compareUser(_name, _igData, _sessionData) {
	const userIg = getUserFrom(_name, _igData)
	const userSession = getUserFrom(_name, _sessionData)
	if(userIg && userSession) {
		const relationships = Object.keys(userSession.relationship)
		relationships.forEach((rel) => {
			if(userSession.relationship[rel] == userIg.relationship[rel]) {

			}
			if(userSession.relationship[rel] == true && userIg.relationship[rel] == false) {
				if(rel !== "unfollowed_you") {
					const newHistoryLog = {
						updated: rel,
						value: false,
						timestamp: igDataLatest
					}
					userSession.relationship[rel] = false
					userSession.history.push(newHistoryLog)
					if(rel == "follower") {
						const myHistoryLog = {
							updated: "unfollowed_you",
							value: true,
							timestamp: igDataLatest
						}
						userSession.relationship["unfollowed_you"] = true
						userSession.history.push(myHistoryLog)
					}
				}
			}
			if(userSession.relationship[rel] == false && userIg.relationship[rel] == true) {
				const foundHistoryLog = userIg.history.find((historyLog) => historyLog.updated == rel && historyLog.value == true)
				userSession.relationship[rel] = true
				userSession.history.push(foundHistoryLog)
			}
		})
	}
	if(!userIg){
		const relationships = Object.keys(userSession.relationship)
		relationships.forEach((rel) => {
			if(userSession.relationship[rel]) {
				if(rel !== "unfollowed_you") {
					const newHistoryLog = {
						updated: rel,
						value: false,
						timestamp: igDataLatest
					}
					userSession.relationship[rel] = false
					userSession.history.push(newHistoryLog)
					if(rel == "follower") {
						const myHistoryLog = {
							updated: "unfollowed_you",
							value: true,
							timestamp: igDataLatest
						}
						userSession.relationship["unfollowed_you"] = true
						userSession.history.push(myHistoryLog)
					}
				}
			}
		})
	}
	if(!userSession){
		_sessionData.push(userIg)
	}
}

function handleDeleteSession() {
	const doubleCheck = window.confirm("Are you sure you want to delete your data?")
	if(doubleCheck) {
		localStorage.removeItem("connectionsLocalSession")
	}
}