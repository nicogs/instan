const connectionsList = document.getElementById("connectionsList")


function getUserTemplate(name) {
	// <li data-relationship="" data-tags="">
	const li = document.createElement("li")
	li.setAttribute("user-name", name)
	li.setAttribute("data-tags", "")
	li.addEventListener("click", handleClickListItem)

	// <div class="uk-card uk-card-small uk-card-default uk-card-body">
	const divCard = document.createElement("div")
	divCard.setAttribute("class", "uk-card uk-card-small uk-card-default uk-animation-slide-bottom uk-card-body")
	li.append(divCard)
	// <div class="uk-grid-small uk-flex-middle" uk-grid>
	const divGrid = document.createElement("div")
	divGrid.setAttribute("class", "uk-grid-small uk-flex-middle")
	divGrid.setAttribute("uk-grid", "")
	divCard.append(divGrid)
	// <div class="uk-width-auto" id="icon">
	const divIcon = document.createElement("div")
	divIcon.setAttribute("class", "uk-width-auto")
	divIcon.setAttribute("id", "icon")
	divGrid.append(divIcon)
	// <i class="fa-solid fa-user-large-slash"></i>

	// <div class="uk-width-expand" id="content">
	const divContent = document.createElement("div")
	divContent.setAttribute("class", "uk-width-expand")
	divContent.setAttribute("id", "content")
	divGrid.append(divContent)
	// <p class="uk-margin-remove-bottom" id="name">NAME</p>
	const nameElement = document.createElement("p")
	nameElement.setAttribute("class", "uk-margin-remove-bottom")
	nameElement.setAttribute("id", "name")
	nameElement.innerText = `@${name}`
	divContent.append(nameElement)
	// <p class="uk-text-meta uk-margin-remove-top uk-position-small uk-position-center-right" id="tags">
	const tagsElement = document.createElement("p")
	tagsElement.setAttribute("class", "uk-text-meta uk-margin-remove-top uk-position-small uk-position-center-right")
	tagsElement.setAttribute("id", "tags")
	divContent.append(tagsElement)

	return li
}

function getDOMElement(_user) {
	const userListItem = getUserTemplate(_user.name)
	const iconDiv = userListItem.querySelector("#icon")
	const cardDiv = userListItem.querySelector(".uk-card")
	const tagsDiv = userListItem.querySelector("#tags")

	let icon = false
	let tags = []

	// following
	if(_user.relationship.following && !_user.relationship.follower && !_user.relationship.unfollowed_you && !_user.relationship.follow_request_received) {
		icon = createUserIcon(connectionOptions.following.icon)
		cardDiv.classList.add("uk-text-warning")
	}
	// Follower
	if(_user.relationship.follower && !_user.relationship.following) {
		icon = createUserIcon(connectionOptions.follower.icon)
	}
	// Mutual
	if(_user.relationship.follower && _user.relationship.following) {
		icon = createUserIcon(connectionOptions.mutual.icon)
		cardDiv.classList.add("uk-text-success")
	}
	// follow_request_pending
	if(_user.relationship.follow_request_pending && !_user.relationship.follower && !_user.relationship.unfollowed_you) {
		icon = createUserIcon(connectionOptions.follow_request_pending.icon)
	}
	// follow_request_received
	if(_user.relationship.follow_request_received) {
		icon = createUserIcon(connectionOptions.follow_request_received.icon)
	}
	// unfollowed_you
	if(_user.relationship.unfollowed_you && !_user.relationship.blocked) {
		icon = createUserIcon(connectionOptions.unfollowed_you.icon)
		cardDiv.classList.add("uk-text-danger")
	} 
	// unfollowed_by_you
	if(_user.relationship.unfollowed_by_you && !_user.relationship.blocked && !_user.relationship.follower) {
		icon = createUserIcon(connectionOptions.unfollowed_by_you.icon)
	}
	// blocked
	if(_user.relationship.blocked) {
		icon = createUserIcon(connectionOptions.blocked.icon)
		cardDiv.classList.add("uk-text-muted")
	}
	// close_friend
	if(_user.relationship.close_friend) {
		tags.push(createUserTag(connectionOptions.close_friend.icon))
	}
	// feed_favorite
	if(_user.relationship.feed_favorite) {
		tags.push(createUserTag(connectionOptions.feed_favorite.icon))
	}

	// restricted
	if(_user.relationship.restricted) {
		if(!icon) {
			icon = createUserIcon(connectionOptions.restricted.icon)
			cardDiv.classList.add("uk-text-muted")
		} else {
			tags.push(createUserTag(connectionOptions.restricted.icon))
		}
	}
	// stories_hidden
	if(_user.relationship.stories_hidden) {
		if(!icon) {
			icon = createUserIcon(connectionOptions.stories_hidden.icon)
			cardDiv.classList.add("uk-text-muted")
		} else {
			tags.push(createUserTag(connectionOptions.stories_hidden.icon))
		}
	}

	iconDiv.append(icon)
	tags.forEach(tag => tagsDiv.append(tag))

	return userListItem
}


function createUserIcon(_icon) {
	const i = document.createElement("i")
	i.setAttribute("class", `fa-solid fa-${_icon}`)
	return i
}

function createUserTag(_icon) {
	const span = document.createElement("span")
	span.setAttribute("class", "uk-badge")

	const i = createUserIcon(_icon)

	span.append(i)
	
	return span

}

function createFilters(){	
	const connections = getSessionFromLocalStorage().connections
	const optionsArray = ["all", "follower", "following", "mutual", "not_following_back", "unfollowed_you", "unfollowed_by_you", "blocked", "follow_request_pending", "follow_request_received"]
	const selectFilterList = document.getElementById("selectFilterList")
	optionsArray.forEach((option, index) => {
		let defaultSelected = index == 0
		const newOptionName = connectionOptions[option].name + " (" + connectionOptions[option].filter(connections).length + ")"
		selectFilterList[index] = new Option(newOptionName, option, defaultSelected, false)
	})
	selectFilterList.addEventListener("change", handleSelectFilter)
}

function createAdditionalFilters() {
	const connections = getSessionFromLocalStorage().connections
	const optionsArray = ["none", "close_friend", "feed_favorite", "restricted", "stories_hidden"]
	const selectAdditionalFilters = document.getElementById("selectAdditionalFilters")

	optionsArray.forEach((option, index) => {
		let defaultSelected = index == 0
		const newOptionName = defaultSelected ? connectionOptions[option].name : connectionOptions[option].name + " (" + connectionOptions[option].filter(connections).length + ")"
		selectAdditionalFilters[index] = new Option(newOptionName, option, defaultSelected, false)
	})

	selectAdditionalFilters.addEventListener("change", handleSelectFilter)
}

function createUserList() {
	createFilters()
	createAdditionalFilters()
	handleSelectFilter()
}

function showLastUpdateTime() {
	const liShowingDataFrom = document.getElementById("liShowingDataFrom")

	const statsfromLS = getSessionFromLocalStorage().stats
	statsfromLS.sort((a,b) => a.timestamp - b.timestamp)

	const latestTimestamp = statsfromLS[statsfromLS.length-1].timestamp
	const latestUpdate = dayjs(new Date(latestTimestamp)).fromNow()
	liShowingDataFrom.innerHTML = "Data from " + latestUpdate
}

function setSelectFilter(_filter){
	const selectFilterList = document.getElementById("selectFilterList")
	for (const option of selectFilterList.options) {
		if(option.value == _filter) {
			option.selected = true
			handleSelectFilter()
		}
	}
}