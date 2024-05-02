function filterList() {
	const users = getSessionFromLocalStorage().connections
	const selectFilterList = document.getElementById("selectFilterList")
	const selectAdditionalFilters = document.getElementById("selectAdditionalFilters")

	const usersFiltered = connectionOptions[selectFilterList.value].filter(users)
	const usersAdditionalFiltered = connectionOptions[selectAdditionalFilters.value].filter(usersFiltered)

	return usersAdditionalFiltered
}

function handleSelectFilter() {
	const users = filterList()
	const btnLoadMoreUsers = createBtnLoadMoreUsers(users)
	const divContainerList = document.getElementById("divContainerList")
	divContainerList.append(btnLoadMoreUsers)

	clearChildren(connectionsList)
	btnLoadMoreUsers.click()
}

function createBtnLoadMoreUsers(_users) {
	const btnLoadMoreUsers = document.getElementById("btnLoadMoreUsers")
	
	if(btnLoadMoreUsers) btnLoadMoreUsers.remove()

	const btn = document.createElement("button")
	btn.setAttribute("class", "uk-button uk-button-text uk-button-large uk-width-1-1 uk-margin-small-bottom")
	btn.setAttribute("id", "btnLoadMoreUsers")
	btn.setAttribute("current-count", 0)
	btn.setAttribute("max-count", _users.length)
	

	const span = document.createElement("span")
	span.setAttribute("class", "uk-margin-small-right uk-icon")
	span.setAttribute("uk-icon", "icon: plus-circle")

	btn.append(span)
	btn.append("Load More users")

	btn.addEventListener("click", () => {
		handleBtnLoadMoreUsersClick(_users)
	})

	return btn
}

function handleBtnLoadMoreUsersClick(_users) {
	const btnLoadMoreUsers = document.getElementById("btnLoadMoreUsers")
	const countFrom = btnLoadMoreUsers.getAttribute("current-count") * 1
	const maxCount = btnLoadMoreUsers.getAttribute("max-count") * 1
	const countTo = Math.min(countFrom + 50, maxCount)

	for (let i = countFrom; i < countTo; i++) {
		const newListItem = getDOMElement(_users[i])
		connectionsList.append(newListItem)
	}

	if(maxCount == countTo) {
		btnLoadMoreUsers.remove()
	} else {
		btnLoadMoreUsers.setAttribute("current-count", countTo)
	}

}