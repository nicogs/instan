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