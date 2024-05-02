if("serviceWorker" in navigator) {
	navigator.serviceWorker.register("./service-worker.js")
	.then((reg) => console.log("Service worker registered", reg))
	.catch((err) => console.log("Service worker not registered", err))
}

iosPWASplash('../img/icons/icon-1024x1024.png')

document.addEventListener("DOMContentLoaded", (event) => {
	checkNotificationPermission()
	// document.designMode = "on"
	if(hasSessionInLocalStorage()) {
		console.log("Has session in localStorage");
		const currentSessionData = getSessionFromLocalStorage()
		renderDom(currentSessionData.connections)
	} else {
		console.log("Has no session in localStorage");
		UIkit.offcanvas("#offcanvas-overlay").show();
	}
});

