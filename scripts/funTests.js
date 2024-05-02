// const nav = UIkit.navbar(".mynav", {
// 	align: "right",
// 	closeOnScroll: "true"
// });

class User {
	constructor(_name) {
		this.name = _name
		this.relationship = {
			following: false,
			follower: false,
			mutual: false,
			blocked: false,
			follow_request_pending: false,
			follow_request_received: false,
			unfollowed_you: false,
			unfollowed_by_you: false,
		}
		this.tag = {
			feed_favorite: false,
			close_friend: false,
			stories_hidden: false,
			restricted: false,
		}
		this.history = []
		this.elements = getUserTemplate(_name)
	}

	addFollowing(_timestamp) {
		this.relationship.following = true
		this.addHistoryLog("following", true, _timestamp)

		this.updateMutual(_timestamp)
	}

	removeFollowing(_timestamp) {
		this.relationship.following = false
		this.addHistoryLog("following", false, _timestamp)

		this.updateMutual(_timestamp)
	}

	addFollower(_timestamp) {
		this.relationship.follower = true
		this.addHistoryLog("follower", true, _timestamp)

		this.updateMutual(_timestamp)
	}

	removeFollower(_timestamp) {
		this.relationship.follower = false
		this.addHistoryLog("follower", false, _timestamp)

		this.updateMutual(_timestamp)
	}

	addMutual(_timestamp) {
		this.relationship.mutual = true
		this.addHistoryLog("mutual", true, _timestamp)
	}

	removeMutual(_timestamp) {
		this.relationship.mutual = false
		this.addHistoryLog("mutual", false, _timestamp)
	}

	updateMutual(_timestamp) {
		
		if(this.relationship.follower == true && this.relationship.following == true) {
			if(this.relationship.mutual == false) { 
				this.addMutual(_timestamp) 
			}
		} else {
			if(this.relationship.mutual == true) { 
				this.removeMutual(_timestamp) 
			}
		}
	}

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

	getLatestLogTimestamp(_updated, _value) {
		const filterHistory = this.history.filter((log) => log.updated == _updated && log.value == _value)
		const latest = filterHistory[filterHistory.length-1].timestamp * 1
		return latest
	}
}

const myClassTest = new User("nicogs")
myClassTest.addFollower(4)
myClassTest.addFollowing(3)

// console.dir(myClassTest)


