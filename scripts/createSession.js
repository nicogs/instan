function createSessionData(_connections, _stats) {
	// Count the amount of every relationship and combine them in to stats
	const newStats = createSessionStats(_connections)

	// temperorary var mySession to be pass through later on
	const mySession = {
		connections: _connections,
		stats: [..._stats]
	}

	console.log("New Styats", newStats)
	// Check if there is already a session logged for a date
	const statIndex = mySession.stats.findIndex(stat => stat.timestamp * 1 == newStats.timestamp)
	if(statIndex == -1) {
		mySession.stats.push(newStats)
	} else {
		mySession.stats.sort((a,b) => a.timestamp - newStats.timestamp)
		mySession.stats.pop()
		mySession.stats.push(newStats)
		// mySession.stats.push(newStats)
		// mySession.stats[statIndex] = newStats
	}
	mySession.stats.sort((a,b) => a.timestamp - b.timestamp)
	return mySession
}

function createSessionStats(_connections) {
	const newSession = {
		stats: {
			following: 0,
			follower: 0,
			feed_favorite: 0,
			blocked: 0,
			close_friend: 0,
			stories_hidden: 0,
			follow_request_pending: 0,
			follow_request_received: 0,
			follow_request_recent: 0,
			unfollowed_by_you: 0,
			unfollowed_you: 0,
			restricted: 0,
			mutual: 0,
			not_following_back:0,
		},
		timestamp: 0
	}

	for (const user of _connections) {

		if(user.relationship.following) newSession.stats.following += 1
		if(user.relationship.follower) newSession.stats.follower += 1
		if(user.relationship.feed_favorite) newSession.stats.feed_favorite += 1
		if(user.relationship.blocked) newSession.stats.blocked += 1
		if(user.relationship.close_friend) newSession.stats.close_friend += 1
		if(user.relationship.stories_hidden) newSession.stats.stories_hidden += 1
		if(user.relationship.follow_request_pending) newSession.stats.follow_request_pending += 1
		if(user.relationship.follow_request_received) newSession.stats.follow_request_received += 1
		if(user.relationship.follow_request_recent) newSession.stats.follow_request_recent += 1
		if(user.relationship.unfollowed_by_you) newSession.stats.unfollowed_by_you += 1
		if(user.relationship.unfollowed_you) newSession.stats.unfollowed_you += 1
		if(user.relationship.restricted) newSession.stats.restricted += 1

		if(user.relationship.follower === true && user.relationship.following === true) newSession.stats.mutual += 1
		if(user.relationship.following === true && user.relationship.follower === false) newSession.stats.not_following_back += 1

		user.history.forEach(log => {
			const newTimeStamp = log.timestamp * 1
			newSession.timestamp = newSession.timestamp <= newTimeStamp ? newTimeStamp : newSession.timestamp

		})

		// newSession.timestamp = user.timestamp.latest * 1000 < newSession.timestamp ? newSession.timestamp : user.timestamp.latest * 1000
	}
	return newSession
}