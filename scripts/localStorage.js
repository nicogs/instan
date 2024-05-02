function saveSessionToLocalStorage(data) {
	const newSession = JSON.stringify(data)
	localStorage.removeItem("connectionsLocalSession");
	localStorage.setItem("connectionsLocalSession", newSession);
}

function hasSessionInLocalStorage() {
	const mySession = localStorage.getItem("connectionsLocalSession")
	
	if(mySession){
		return true
	} else {
		return false
	}
}

function getSessionFromLocalStorage() {
	if(hasSessionInLocalStorage()) {
		const mySession = JSON.parse(localStorage.getItem("connectionsLocalSession"))
		return mySession
	} else {
		console.log("No Session in Local storage")
	}
	
	
}

function saveSessionFromLocalStorageToJSON() {
	if(hasSessionInLocalStorage()) {
		const mySessionData = localStorage.getItem("connectionsLocalSession")
		const mySession = JSON.parse(mySessionData)
		const latestTimestamp = new Date(mySession.stats[mySession.stats.length-1].timestamp)

		const fileName = "_ " + latestTimestamp.getFullYear() + "_" + latestTimestamp.getMonth()+1 + "_" + latestTimestamp.getDate() + " session_followerInstanalytics.json"
		
		downloadFile(mySessionData, fileName, "application/json")
	} else {
		console.log("No Session in Local storage")
	}
}