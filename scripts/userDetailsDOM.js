function handleClickListItem() {
	const userName = this.getAttribute("user-name")
	const user = getUserFrom(userName, getSessionFromLocalStorage().connections)
	
	renderHistory(user)
	renderRelationships(user)
	
	const modalUserDetailsTitle = document.getElementById("modalUserDetailsTitle")
	const anchorUserDetails = document.getElementById("anchorUserDetails")
	
	modalUserDetailsTitle.innerText = "@" + userName
	anchorUserDetails.href = "https://instagram.com/" + userName
	console.dir(user)

	UIkit.modal("#modalUserDetails").show();
}

function renderTableLog(_timestamp, _activityLog){
	const tr = document.createElement("tr")

	const tdTimestamp = document.createElement("td")
	tdTimestamp.classList.add("uk-text-meta")
	tdTimestamp.innerText = _timestamp

	const tdLog = document.createElement("td")
	tdLog.innerText = _activityLog

	tr.append(tdTimestamp)
	tr.append(tdLog)
	return tr
}

function convertHistoryToContent(_user) {
	const history = _user.history.toReversed();
	const activityLogs = [] 
	for (const log of history) {
		
		if(log.updated !== "mutual" && log.updated !== "not_following_back" && log.updated !== "unfollowed_by_you" && log.updated !== "unfollowed_you"){
			const timestamp = dayjs(new Date(log.timestamp)).fromNow()

			// If follow request pending = false in activity log => Check waht happened afterwards
			if(log.updated == "follow_request_pending" && log.value == false) {
				const filterHistory = history.filter((_log) => _log.updated == "following" && _log.timestamp * 1 == log.timestamp * 1)
				const content = connectionOptions.follow_request_pending.historyContent.false(_user.name, filterHistory)
				activityLogs.push([timestamp, content])
			}
			// If follow request recieved = false in activity log => Check waht happened afterwards
			if(log.updated == "follow_request_received" && log.value == false) {
				const filterHistory = history.filter((_log) => _log.updated == "follower" && _log.timestamp * 1 == log.timestamp * 1)
				const content = connectionOptions.follow_request_received.historyContent.false(_user.name, filterHistory)
				activityLogs.push([timestamp, content])
			}

			if(log.updated != "follow_request_received" && log.updated != "follow_request_pending"){
				const content = connectionOptions[log.updated].historyContent[log.value](_user.name)
				activityLogs.push([timestamp, content])
			}
		}
		
		
	}
	return activityLogs
}

function renderHistory(_user){
	const tbodyUserDetailsHistory = document.getElementById("tbodyUserDetailsHistory")
	clearChildren(tbodyUserDetailsHistory)

	const historyContent = convertHistoryToContent(_user)

	historyContent.forEach(([timestamp, content]) => {
		const tableRow = renderTableLog(timestamp, content)
		tbodyUserDetailsHistory.append(tableRow)
	});

}

function renderRelationships(_user){
	const ulUserDetails = document.getElementById("ulUserDetails")
	clearChildren(ulUserDetails)
	if(_user.relationship.follower && !_user.relationship.following){
		const newListItem = createRelationshipListItem(connectionOptions.follower)
		ulUserDetails.append(newListItem)
	}

	if(_user.relationship.following && !_user.relationship.follower){
		ulUserDetails.append(createRelationshipListItem(connectionOptions.following))
		ulUserDetails.append(createRelationshipListItem(connectionOptions.not_following_back))
	}
	if(_user.relationship.following && _user.relationship.follower){
		ulUserDetails.append(createRelationshipListItem(connectionOptions.mutual))
	}
	if(_user.relationship.blocked){
		ulUserDetails.append(createRelationshipListItem(connectionOptions.blocked))
	}
	if(_user.relationship.close_friend){
		ulUserDetails.append(createRelationshipListItem(connectionOptions.close_friend))
	}
	if(_user.relationship.feed_favorite){
		ulUserDetails.append(createRelationshipListItem(connectionOptions.feed_favorite))
	}
	if(_user.relationship.follow_request_pending){
		ulUserDetails.append(createRelationshipListItem(connectionOptions.follow_request_pending))
	}
	if(_user.relationship.follow_request_received){
		ulUserDetails.append(createRelationshipListItem(connectionOptions.follow_request_received))
	}
	if(_user.relationship.restricted){
		ulUserDetails.append(createRelationshipListItem(connectionOptions.restricted))
	}
	if(_user.relationship.stories_hidden){
		ulUserDetails.append(createRelationshipListItem(connectionOptions.stories_hidden))
	}
}

function createRelationshipListItem(_relationship){
	const li = document.createElement("li")
	const span = document.createElement("span")
	span.setAttribute("class", "uk-margin-small-right uk-icon")

	const icon = createUserIcon(_relationship.icon)
	span.append(icon)
	li.append(span)
	li.append(_relationship.name)

	return li
}