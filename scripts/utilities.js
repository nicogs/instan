function clearChildren(_node) {
	const nodeChildren = _node.children
	for (let i = 0; i < nodeChildren.length; i = 0) {
		nodeChildren[i].remove();
	}

}

function getUserFrom(_name, _users) {
	const userIndex = _users.findIndex((user) => user.name === _name)
	if(userIndex === -1) {
		return false
	} else {
		return _users[userIndex]
	}
}

const connectionOptions = {
	all: {
		name: "All",
		icon: "user",
		type: "relationship",
		filter: (_connections) => {return _connections},
	},
	none: {
		name: "None",
		icon: "user",
		type: "tag",
		filter: (_connections) => {return _connections},
	},
	follower: {
		name: "Follower",
		icon: "person-arrow-down-to-line",
		type: "relationship",
		filter: (_connections) => {return _connections.filter((user) => user.relationship.follower === true)},
		historyContent: {
			true: (_name) => `@${_name} followed you`,
			false: (_name) => `@${_name} Unfollowed you`,
		}
	},
	following: { 
		name: "You are Following",
		icon: "person-arrow-up-from-line",
		type: "relationship",
		filter: (_connections) => {return _connections.filter((user) => user.relationship.following === true)},
		historyContent: {
			true: (_name) => `You started following @${_name}`,
			false: (_name) => `You unfollowed @${_name}`,
		}
	},
	mutual: {
		name: "Mutual, you follow each other",
		icon: "person-walking-arrow-loop-left",
		type: "relationship",
		filter: (_connections) => { return _connections.filter((user) => user.relationship.follower === true && user.relationship.following === true)}
	},
	not_following_back: { 
		name: "Not Following Back",
		icon: "person-walking-dashed-line-arrow-right",
		type: "relationship",
		filter: (_connections) => {return _connections.filter((user) => user.relationship.following === true && user.relationship.follower === false )}
	},
	unfollowed_by_you: {
		name: "You recently unfollowed",
		icon: "user-minus",
		type: "relationship",
		filter: (_connections) => {return _connections.filter((user) => user.relationship.unfollowed_by_you === true && user.relationship.following === false)}
	},
	unfollowed_you: {
		name: "Unfollowed You",
		icon: "user-minus",
		type: "relationship",
		filter: (_connections) => {return _connections.filter((user) => user.relationship.unfollowed_you === true && user.relationship.follower === false)}
	},
	blocked: {
		name: "Blocked by You",
		icon: "user-large-slash",
		type: "relationship",
		filter: (_connections) => {
			return _connections.filter((user) => user.relationship.blocked === true)
		},
		historyContent: {
			true: (_name) => `You blocked @${_name}`,
			false: (_name) => `You unblocked @${_name}`,
		}
	},
	close_friend: {
		name: "Close friends",
		icon: "circle-user",
		type: "tag",
		filter: (_connections) => {return _connections.filter((user) => user.relationship.close_friend === true)},
		historyContent: {
			true: (_name) => `You added @${_name} to your close-friends`,
			false: (_name) => `You removed @${_name} from your close-friends`,
		}
	},
	feed_favorite: {
		name: "Favorites",
		icon: "star",
		type: "tag",
		filter: (_connections) => {return _connections.filter((user) => user.relationship.feed_favorite === true)},
		historyContent: {
			true: (_name) => `You added @${_name} to your in-feed favourites`,
			false: (_name) => `You removed @${_name} from your in-feed favourites`,
		}
	},
	follow_request_pending: {
		name: "Pending Follow Requests",
		icon: "person-circle-question",
		type: "relationship",
		filter: (_connections) => { return _connections.filter((user) => user.relationship.follow_request_pending === true && user.relationship.following === false)},
		historyContent: {
			true: (_name) => `Your request to follow @${_name} is pending`,
			false: (_name, _following) => _following ? `You request to follow @${_name} was accepted` : `You request to follow @${_name} was removed or declined`,
		}
	},
	follow_request_received: {
		name: "Follow Requests Received",
		icon: "person-circle-exclamation",
		type: "relationship",
		filter: (_connections) => {return _connections.filter((user) => user.relationship.follow_request_received === true && user.relationship.follower === false)},
		historyContent: {
			true: (_name) => `@${_name} has requested to follow you`,
			false: (_name, _follower) => _follower ? `You approved @${_name}'s follow request` : `The follow request by @${_name} was removed or declined`,
		}
	},
	follow_request_recent: {
		name: "Recent Follow Requests Send by You",
		icon: "user-gear",
		type: "relationship",
		filter: (_connections) => {return _connections.filter((user) => user.relationship.follow_request_recent === true && user.relationship.follow_request_pending === true)}
	},
	
	restricted: {
		name: "Restricted",
		icon: "user-lock",
		type: "tag",
		filter: (_connections) => {return _connections.filter((user) => user.relationship.restricted === true)},
		historyContent: {
			true: (_name) => `You restricted @${_name}`,
			false: (_name) => `You removed the restrictions for @${_name}`,
		}
	},
	stories_hidden: {
		name: "Stories are hidden",
		icon: "eye-slash",
		type: "tag",
		filter: (_connections) => {return _connections.filter((user) => user.relationship.stories_hidden === true)},
		historyContent: {
			true: (_name) => `Your stories are hidden from @${_name}`,
			false: (_name) => `Your stories are no longer hidden from @${_name}`,
		}
	},
	
	
}


function addHistoryLog(user, _updated, _value, _timestamp){
	const filterHistory = user.history.filter((log) => log.updated == _updated && log.value == _value && log.timestamp * 1 == _timestamp * 1)
	if(filterHistory.length < 1) {
		user.history.push({
			updated: _updated,
			value: _value,
			timestamp: _timestamp
		})
		user.history.sort((a, b) => a.timestamp - b.timestamp)
	}
}


let igDataLatest = 0

function sortHistory(_connections) {
	for (const user of _connections) {
		user.history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
	}
}

function sortByHistory(_connections) {
	sortHistory(_connections)
	_connections.sort((a, b) => new Date(b.history[0].timestamp) - new Date(a.history[0].timestamp))
}

function downloadFile(data, name, type) {
	// const { createElement } = document
	const { URL: { createObjectURL, revokeObjectURL }, setTimeout } = window
  
	const blob = new Blob([data], { type })
	const url = createObjectURL(blob)
  
	const anchor = document.createElement('a')
	// anchor.target('_blank')
	anchor.setAttribute('href', url)
	
	anchor.setAttribute('target', '_blank')
	anchor.setAttribute('download', name)
	document.body.appendChild(anchor)
	anchor.click()
	document.body.removeChild(anchor)
	
	setTimeout(() => { revokeObjectURL(url) }, 100)
}

function iosPWASplash(t, e="white") {
    if ("string" != typeof t || 0 === t.length)
        throw Error("Invalid icon URL provided");
    let i = screen.width
      , a = screen.height
      , h = window.devicePixelRatio || 1
      , n = document.createElement("canvas")
      , l = document.createElement("canvas")
      , r = n.getContext("2d")
      , d = l.getContext("2d")
      , o = new Image;
    o.onerror = function() {
        throw Error("Failed to load icon image")
    }
    ,
    o.src = t,
    o.onload = function() {
        let t = o.width / (3 / h)
          , g = o.height / (3 / h);
        n.width = i * h,
        l.height = n.width,
        n.height = a * h,
        l.width = n.height,
        r.fillStyle = e,
        d.fillStyle = e,
        r.fillRect(0, 0, n.width, n.height),
        d.fillRect(0, 0, l.width, l.height);
        let c = (n.width - t) / 2
          , p = (n.height - g) / 2
          , s = (l.width - t) / 2
          , w = (l.height - g) / 2;
        r.drawImage(o, c, p, t, g),
        d.drawImage(o, s, w, t, g);
        let m = n.toDataURL("image/png")
          , u = l.toDataURL("image/png")
          , f = document.createElement("link");
        f.setAttribute("rel", "apple-touch-startup-image"),
        f.setAttribute("media", "screen and (orientation: portrait)"),
        f.setAttribute("href", m),
        document.head.appendChild(f);
        let A = document.createElement("link");
        A.setAttribute("rel", "apple-touch-startup-image"),
        A.setAttribute("media", "screen and (orientation: landscape)"),
        A.setAttribute("href", u),
        document.head.appendChild(A)
    }
}

async function requestNotificationPermission() {
	const permission = await Notification.requestPermission();
	if (permission === 'granted') {
		console.log("🛎️ Request Notifications Granted ")
	}
}

async function checkNotificationPermission() {
	const permissionStatus = await navigator.permissions.query({ name: 'notifications' })

	if(permissionStatus.state == "granted") {
		console.log("🛎️ Notifications are Granted")
	}
	if(permissionStatus.state == "denied") {
		console.log("🛎️ Notifications are denied")
	}
	if(!permissionStatus.state){
		console.log("🛎️ Notifications are not yet granted")
		await requestNotificationPermission();
	}

}

// async function subscribeToPush() {
// 	let serverPublicKey = VAPID_PUBLIC_KEY

// 	let subscriptionOptions = {
// 		userVisibleOnly: true, 
// 		applicationServerKey: serverPublicKey
// 	}

// 	let subscription = swRegis
// }