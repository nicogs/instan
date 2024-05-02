let chartInstanceOverview
// CREATE TILES NUMBERS 
function renderTileNumbers() {
	const sessionData = getSessionFromLocalStorage()
	const sessionStats = sessionData.stats
	
	const tileFollowers = document.getElementById("tileFollowers")
	const tileFollowersNumber = document.getElementById("tileFollowersNumber")
	const tileFollowersDifference = document.getElementById("tileFollowersDifference")
	tileFollowers.addEventListener("click", handleTileClick)

	const tileFollowing = document.getElementById("tileFollowing")
	const tileFollowingNumber = document.getElementById("tileFollowingNumber")
	const tileFollowingDifference = document.getElementById("tileFollowingDifference")
	tileFollowing.addEventListener("click", handleTileClick)


	const tileUnfollowedYou = document.getElementById("tileUnfollowedYou")
	const tileUnfollowedYouNumber = document.getElementById("tileUnfollowedYouNumber")
	const tileUnfollowedYouDifference = document.getElementById("tileUnfollowedYouDifference")
	tileUnfollowedYou.addEventListener("click", handleTileClick)


	const tileNotFollowingBack = document.getElementById("tileNotFollowingBack")
	const tileNotFollowingBackNumber = document.getElementById("tileNotFollowingBackNumber")
	const tileNotFollowingBackDifference = document.getElementById("tileNotFollowingBackDifference")
	tileNotFollowingBack.addEventListener("click", handleTileClick)


	const currentStats = sessionStats[sessionStats.length - 1].stats
	const gainedFollowers = [0]
	const gainedFollowings = [0]
	const netUnfollowers = [0]
	const notFollowingBack = [0]
	for (let i = 1; i < sessionStats.length; i++) {
		const gainedFollower = sessionStats[i].stats.follower - sessionStats[i-1].stats.follower + sessionStats[i].stats.unfollowed_you - sessionStats[i-1].stats.unfollowed_you
		const gainedFollowing = sessionStats[i].stats.following - sessionStats[i-1].stats.following + sessionStats[i].stats.unfollowed_by_you - sessionStats[i-1].stats.unfollowed_by_you
		const netUnfollowedYou = sessionStats[i].stats.unfollowed_you - sessionStats[i-1].stats.unfollowed_you
		const netNotFollowingBack = sessionStats[i].stats.not_following_back - sessionStats[i-1].stats.not_following_back

		gainedFollowers.push(gainedFollower)
		gainedFollowings.push(gainedFollowing)
		netUnfollowers.push(netUnfollowedYou)
		notFollowingBack.push(netNotFollowingBack)
	}



	tileFollowersNumber.innerText = currentStats.follower
	tileFollowingNumber.innerText = currentStats.following
	tileUnfollowedYouNumber.innerText = currentStats.unfollowed_you
	tileNotFollowingBackNumber.innerText = currentStats.not_following_back
	
	styleStatDifference(gainedFollowers[gainedFollowers.length-1], tileFollowersDifference)
	styleStatDifference(gainedFollowings[gainedFollowings.length-1], tileFollowingDifference)
	styleStatDifference(netUnfollowers[netUnfollowers.length-1], tileUnfollowedYouDifference)
	styleStatDifference(notFollowingBack[notFollowingBack.length-1], tileNotFollowingBackDifference)
	
}

function styleStatDifference(diff, el) {
	/**
	 * This function is used display and style the small number below the total number of a tile, that will show the difference between last upload
	 */
	if(diff > 0) {
		el.setAttribute("class", "uk-margin-remove-top uk-text-meta uk-text-success")
		el.innerHTML = `<span uk-icon="triangle-up">+${diff}</span>`
	}

	if(diff == 0) {
		el.setAttribute("class", "uk-margin-remove-top uk-text-meta uk-text-primary")
		el.innerHTML = `<span uk-icon="triangle-left">${diff}</span>`
	}

	if(diff < 0) {
		el.setAttribute("class", "uk-margin-remove-top uk-text-meta uk-text-danger")
		el.innerHTML = `<span uk-icon="triangle-down">${diff}</span>`
	}


}

function getDeltas() {
	const sessionData = getSessionFromLocalStorage()
	const sessionStats = sessionData.stats

	const currentStats = sessionStats[sessionStats.length - 1].stats
	const gainedFollowers = [0]
	const lostFollowers = [0]
	const gainedFollowings = [0]
	const netUnfollowers = [0]
	const notFollowingBack = [0]

	for (let i = 1; i < sessionStats.length; i++) {
		const gainedFollower = sessionStats[i].stats.follower - sessionStats[i-1].stats.follower + sessionStats[i].stats.unfollowed_you - sessionStats[i-1].stats.unfollowed_you
		const lostFollower = sessionStats[i-1].stats.follower -  sessionStats[i].stats.follower + gainedFollower
		const gainedFollowing = sessionStats[i].stats.following - sessionStats[i-1].stats.following + sessionStats[i].stats.unfollowed_by_you - sessionStats[i-1].stats.unfollowed_by_you
		const netUnfollowedYou = sessionStats[i].stats.unfollowed_you - sessionStats[i-1].stats.unfollowed_you
		const netNotFollowingBack = sessionStats[i].stats.not_following_back - sessionStats[i-1].stats.not_following_back
		// const 
		gainedFollowers.push(gainedFollower)
		lostFollowers.push(lostFollower * -1)
		gainedFollowings.push(gainedFollowing)
		netUnfollowers.push(netUnfollowedYou)
		notFollowingBack.push(netNotFollowingBack)

	}

	return [gainedFollowers, lostFollowers, gainedFollowings, netUnfollowers]
}

function createOverviewChart() {
	const overviewContext = document.getElementById("overviewChart")
	const sessionData = getSessionFromLocalStorage()
	const deltaData = getDeltas()
	const totalFollowersArray = sessionData.stats.map(session => session.stats.follower)

	const overviewData = {
		labels: getLabelDates(),
		datasets: [
			{
				type: 'bar',
				stack: "one",
				label: 'Gained Followers',
				data: deltaData[0],
				backgroundColor: '#2c40b3',
				yAxisID: "y",
				order: 3,
				maxBarThickness: 25,
			},
			{
				type: 'bar',
				label: 'Lost Followers',
				stack: "one",
				data: deltaData[1],
				backgroundColor: '#8c8af8',
				yAxisID: "y",
				order: 2,
				maxBarThickness: 25,
			},
			{
				type: 'line',
				label: 'Total Followers',
				data: totalFollowersArray,
				tension: 0.35,
				fill: false,
				borderColor: '#FF520E',
				yAxisID: "y1",
				order: 1,
			},
		],
	}

	const overviewConfig = {
		type: 'scatter',
		data: overviewData,
		options: {
			scales: {
				y: { beginAtZero: true, grace: '45%', type: 'linear', display: false, },
				y1: {
					beginAtZero: false,
					grace: '25%',
					type: 'linear',
					display: false,
				},
			},
			plugins: {
				title: { display: false },
				legend: { display: false },
			},
			
		},
	}
	
	chartInstanceOverview = new Chart(overviewContext, overviewConfig);
	console.log(chartInstanceOverview)
}

function getLabelDates() {
	const sessionData = getSessionFromLocalStorage()
	const dateLabels = []
	for (const session of sessionData.stats) {
		const logDate = new Date(session.timestamp)
		dateLabels.push(dayjs(logDate).format("DD/MM"))
	}

	return dateLabels
}

function getFollowersStats() {
	const sessionData = getSessionFromLocalStorage()
	const userList = sessionData.connections
	const followerAmountLogs = []
	for (const user of userList) {
		const followerLogs = user.history.filter((log) => log.updated == "follower" && log.value == true)
		followerLogs.forEach((log) => {

			const timestampIndex = followerAmountLogs.findIndex((followerLog) => Math.floor(followerLog.timestamp/(2629743*1000))*2629743*1000 == Math.floor(log.timestamp/(2629743*1000))*2629743*1000)

			if(timestampIndex === -1) {
				followerAmountLogs.push({amount: 1, timestamp: Math.floor(log.timestamp/(2629743*1000))*2629743*1000})
			} else {
				followerAmountLogs[timestampIndex].amount += 1
			}
		})
	}
	followerAmountLogs.sort((a,b) => a.timestamp - b.timestamp)
	const amountsArray = followerAmountLogs.map(e => e.amount)
	const daysArray = followerAmountLogs.map(e => {
		const day = new Date(e.timestamp)
		return day.toLocaleDateString()
	})
	return [daysArray, amountsArray]
}

function renderCharts() {
	// const overviewChart = document.getElementById("overviewChart")
	if(chartInstanceOverview) chartInstanceOverview.destroy()
	createOverviewChart()
}

function handleTileClick() {
	
	// ["all", "follower", "following", "mutual", "not_following_back", "unfollowed_you", "unfollowed_by_you", "blocked", "follow_request_pending", "follow_request_received"]
	if(this.id == "tileFollowers") {
		setSelectFilter("follower")
	}
	if(this.id == "tileFollowing") {
		setSelectFilter("following")
	}
	if(this.id == "tileUnfollowedYou") {
		setSelectFilter("unfollowed_you")
	}
	if(this.id == "tileNotFollowingBack") {
		setSelectFilter("not_following_back")
	}
	UIkit.scroll(this).scrollTo("#connectionsList");
}