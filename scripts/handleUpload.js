const inputZIP = document.getElementById("inputZIP")
const inputInstaOffCanvas = document.getElementById("inputInstaOffCanvas")
inputZIP.addEventListener("change", loadZIP)
inputInstaOffCanvas.addEventListener("change", loadZIP)


const inputSession = document.getElementById("inputSession")
const inputSessionOffCanvas = document.getElementById("inputSessionOffCanvas")
inputSession.addEventListener("change", loadSession)
inputSessionOffCanvas.addEventListener("change", loadSession)


const tileIgDataDiv = document.getElementById("tileIgDataDiv")
const tileSessionDataDiv = document.getElementById("tileSessionDataDiv")


const btnInstaOffCanvas = document.getElementById("btnInstaOffCanvas")
btnInstaOffCanvas.addEventListener("click", () => {
	
	handleUpload(instaUploadedList, instaUploadLatestTimestamp)
	UIkit.offcanvas("#offcanvas-overlay").hide();
})

const btnInstaNav = document.getElementById("btnInstaNav")
btnInstaNav.addEventListener("click", () => handleUpload(instaUploadedList, instaUploadLatestTimestamp))

const btnSessionOffCanvas = document.getElementById("btnSessionOffCanvas")
btnSessionOffCanvas.addEventListener("click", () => {
	saveSessionToLocalStorage(sessionUploaded)
	handleUpload(sessionUploadedList, sessionUploadLatestTimestamp)
	UIkit.offcanvas("#offcanvas-overlay").hide();
})
const btnSessionNav = document.getElementById("btnSessionNav")
btnSessionNav.addEventListener("click", () => {
	saveSessionToLocalStorage(sessionUploaded)
	handleUpload(sessionUploadedList, sessionUploadLatestTimestamp)
})


function handleOffCanvasLoadIn() {
	handleLoadIn()
	UIkit.offcanvas("#offcanvas-overlay").hide();
}



function handleUpload(_userList, _timestamp) {
		if(hasSessionInLocalStorage()){
			const sessionFromLocalStorage = getSessionFromLocalStorage()
			const sessionFromLocalStorageTimestamp = sessionFromLocalStorage.stats[sessionFromLocalStorage.stats.length-1].timestamp * 1
			const updatedUserList = compareData(_timestamp, _userList, sessionFromLocalStorageTimestamp, sessionFromLocalStorage.connections)
			const updatedSessionData = createSessionData(updatedUserList, sessionFromLocalStorage.stats)
			console.log(updatedUserList)
			saveSessionToLocalStorage(updatedSessionData)
			// return updatedSessionData
		} else {
			const updatedSessionData = createSessionData(_userList, [])
			saveSessionToLocalStorage(updatedSessionData)
			// return updatedSessionData
		}
		// instaUploadLatestTimestamp = 0 
		// instaUploadedList = []
		// sessionUploadLatestTimestamp = 0 
		// sessionUploadedList = []
		const sessionFromLocalStorage = getSessionFromLocalStorage()
		console.log(sessionFromLocalStorage)
		// renderDom(sessionFromLocalStorage.connections)
		location.reload()
}

function renderDom(_userList) {
	// renderConnectionsList(_userList)
	// OptionsDOM(_userList)
	createUserList()
	renderTileNumbers(_userList)
	renderCharts()
	showLastUpdateTime()
}

function compareData(_latestTimestampA, _usersA, _latestTimestampB, _usersB) {
	const usersNewData = _latestTimestampA * 1 > _latestTimestampB * 1 ? _usersA : _usersB
	const newTimestamp = _latestTimestampA * 1 > _latestTimestampB * 1 ? _latestTimestampA * 1 : _latestTimestampB * 1
	const usersOldData = _latestTimestampA * 1 > _latestTimestampB * 1 ? _usersB : _usersA
	const updatedUsers = []

	usersNewData.forEach((newUser) => {
		const updatedUser = compareNewUserToOldUserData(newUser, newTimestamp, usersOldData)
		if(updatedUser) {
			updatedUsers.push(updatedUser)
		} 
		
	})
	usersOldData.forEach((oldUser) => {
		const updatedUser = compareOldUserToNewUserData(oldUser, newTimestamp, usersNewData)
		if(updatedUser) {
			updatedUsers.push(updatedUser)
		}
	})

	updatedUsers.sort((a, b) => b.history[b.history.length-1].timestamp *1 - a.history[a.history.length-1].timestamp *1)
	
	return updatedUsers
}

function compareNewUserToOldUserData(_newUser, _newTimestamp, _oldUserData) {
	
	const oldUser = getUserFrom(_newUser.name, _oldUserData)
	if(oldUser) {
		if(_newUser.relationship.following == oldUser.relationship.following){

		} else {
			if(_newUser.relationship.following == true && oldUser.relationship.following == false){
				const filterHistory = _newUser.history.filter((log) => log.updated == "following" && log.value == true)
				const latest = filterHistory[filterHistory.length-1].timestamp * 1
				oldUser.relationship.following = true
				addHistoryLog(oldUser, "following", true, latest)
			}
			if(_newUser.relationship.following == false && oldUser.relationship.following == true){
				const filterHistory = _newUser.history.filter((log) => log.updated == "unfollowed_by_you" && log.value == true)
				// const latest = filterHistory[filterHistory.length-1].timestamp * 1
				const latest = filterHistory.length > 0 ? filterHistory[filterHistory.length-1].timestamp * 1 : _newTimestamp
				oldUser.relationship.following = false
				addHistoryLog(oldUser, "following", false, latest)
			}
		}

		if(_newUser.relationship.follower == oldUser.relationship.follower){

		} else {
			if(_newUser.relationship.follower == true && oldUser.relationship.follower == false){
				const filterHistory = _newUser.history.filter((log) => log.updated == "follower" && log.value == true)
				const latest = filterHistory[filterHistory.length-1].timestamp * 1
				oldUser.relationship.follower = true
				addHistoryLog(oldUser, "follower", true, latest)
			}
			if(_newUser.relationship.follower == false && oldUser.relationship.follower == true){
				
				oldUser.relationship.follower = false
				addHistoryLog(oldUser, "follower", false, _newTimestamp)

				oldUser.relationship.unfollowed_you = true
				addHistoryLog(oldUser, "unfollowed_you", true, _newTimestamp)
			}
		}

		if(_newUser.relationship.unfollowed_by_you == oldUser.relationship.unfollowed_by_you){

		} else {
			if(_newUser.relationship.unfollowed_by_you == true && oldUser.relationship.unfollowed_by_you == false){
				const filterHistory = _newUser.history.filter((log) => log.updated == "unfollowed_by_you" && log.value == true)
				const latest = filterHistory[filterHistory.length-1].timestamp * 1
				oldUser.relationship.unfollowed_by_you = true
				addHistoryLog(oldUser, "unfollowed_by_you", true, latest)
			}
			if(_newUser.relationship.unfollowed_by_you == false && oldUser.relationship.unfollowed_by_you == true){
				if(_newUser.relationship.following == true) {
					const filterHistory = _newUser.history.filter((log) => log.updated == "following" && log.value == true)
					const latest = filterHistory[filterHistory.length-1].timestamp * 1
					oldUser.relationship.unfollowed_by_you = false
					addHistoryLog(oldUser, "unfollowed_by_you", false, latest)
				}
			}
		}

		if(_newUser.relationship.unfollowed_you == oldUser.relationship.unfollowed_you){

		} else {
			if(_newUser.relationship.unfollowed_you == false && oldUser.relationship.unfollowed_you == true){
				if(_newUser.relationship.follower == true) {
					const filterHistory = _newUser.history.filter((log) => log.updated == "follower" && log.value == true)
					const latest = filterHistory[filterHistory.length-1].timestamp * 1
					oldUser.relationship.unfollowed_you = false
					addHistoryLog(oldUser, "unfollowed_you", false, latest)
				}
			}
		}

		const restRelationships = ["feed_favorite", "blocked", "close_friend", "stories_hidden", "follow_request_pending", "follow_request_received", "follow_request_recent", "restricted"] 

		restRelationships.forEach((rel) => {
			if(_newUser.relationship[rel] == oldUser.relationship[rel]){

			} else {
				if(_newUser.relationship[rel] == true && oldUser.relationship[rel] == false){
					const filterHistory = _newUser.history.filter((log) => log.updated == rel && log.value == true)
					const latest = filterHistory[filterHistory.length-1].timestamp * 1
					oldUser.relationship[rel] = true
					addHistoryLog(oldUser, rel, true, latest)
				}
				if(_newUser.relationship[rel] == false && oldUser.relationship[rel] == true){
					
					oldUser.relationship[rel] = false
					addHistoryLog(oldUser, rel, false, _newTimestamp)
	
				}
			}
		})
		
		return oldUser
	} else {
		return _newUser
	}
}

function compareOldUserToNewUserData(_oldUser, _newTimestamp, _newUserData){
	const newUser = getUserFrom(_oldUser.name,  _newUserData)
	if(newUser == false ) {
		if(_oldUser.relationship.blocked == false) {
			// If the person was blocked before, then it should be in the newUsers list as blocked, otherwise you have unblocked them. In that case the user should not be added anymore unless they have a new connection with the user, but then they should've been on the new users list.
			if(_oldUser.relationship.following == true) {
				_oldUser.relationship.following = false
				addHistoryLog(_oldUser, "following", false, _newTimestamp)

				_oldUser.relationship.unfollowed_by_you = true
				addHistoryLog(_oldUser, "unfollowed_by_you", true, _newTimestamp)
			}

			if(_oldUser.relationship.follower == true) {
				_oldUser.relationship.follower = false
				addHistoryLog(_oldUser, "follower", false, _newTimestamp)

				_oldUser.relationship.unfollowed_you = true
				console.log(_oldUser.name, "unfolloed you")
				addHistoryLog(_oldUser, "unfollowed_you", true, _newTimestamp)
			}

			const restRelationships = ["feed_favorite", "close_friend", "stories_hidden", "follow_request_pending", "follow_request_received", "follow_request_recent", "restricted"] 
			restRelationships.forEach((rel) => {
				if(_oldUser.relationship[rel] == true) {
					_oldUser.relationship[rel] = false
					addHistoryLog(_oldUser, rel, false, _newTimestamp)
				}
			})

			return _oldUser
		}
	}
}