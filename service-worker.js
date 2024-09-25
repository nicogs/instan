const staticCacheName = "site-static-v5"
const dynamicCache = "site-dynamic-v4"
const assets = [
	"instan/",
	"instan/index.html",
	"instan/howto.html",
	"instan/scripts/libraries/dayjs.min.js",
	"instan/scripts/libraries/relativeTime.js",
	"instan/scripts/libraries/uikit-icons.min.js",
	"instan/scripts/libraries/uikit.min.js",
	"instan/scripts/libraries/zip-full.min.js",
	"instan/scripts/createSession.js",
	"instan/scripts/createTiles.js",
	"instan/scripts/handleDataIG.js",
	"instan/scripts/handleSession.js",
	"instan/scripts/handleUpload.js",
	"instan/scripts/loadApp.js",
	"instan/scripts/localStorage.js",
	"instan/scripts/optionsDropdowns.js",
	"instan/scripts/userDetailsDOM.js",
	"instan/scripts/userListDOM.js",
	"instan/scripts/utilities.js",
	"instan/styles/uikit.css",
	"instan/styles/style.css",
	"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
	"https://cdn.jsdelivr.net/npm/chart.js",
	"instan/img/howto/howto_0.png",
	"instan/img/howto/howto_1.png",
	"instan/img/howto/howto_2.png",
	"instan/img/howto/howto_3.png",
	"instan/img/howto/howto_4.png",
	"instan/img/howto/howto_5.png",
	"instan/img/howto/howto_6.png",
	"instan/img/howto/howto_7.png",
	"instan/img/howto/howto_8.png",
	"instan/img/howto/howto_9.png",
	"instan/img/howto/howto_10.png",
	"instan/img/howto/howto_11.png",
	"instan/img/howto/howto_12.png",
	"instan/img/icons/launch.png",
	"instan/img/icons/icon-192x192.png"
]

// Install service worker
self.addEventListener("install", event => { 
	console.log("✅ service worker has been installed ")
	event.waitUntil(
		caches.open(staticCacheName).then(cache => {
			console.log("⚙️ Cashing shell assets ...")
			cache.addAll(assets)
		})
	)
})

// Activate service worker
self.addEventListener("activate", event => { 
	console.log("✅ service worker has been activated ")
	event.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(key => key !== staticCacheName)
				.map(key => caches.delete(key))
			)
		})
	)
	setTimeout(() => {
		mimicNotif()
	}, 5000)
})

// Fetch event
self.addEventListener("fetch", event => { 
	// console.log("✅ service worker has been activated ")

	event.respondWith(
		caches.match(event.request).then(cacheResponse => {
			return cacheResponse || fetch(event.request).then(fetchResponse => {
				return caches.open(dynamicCache).then(cache => {
					cache.put(event.request.url, fetchResponse.clone())
					return fetchResponse
				})
			})
		})
	)
})

self.addEventListener("push", (event) => {
	const promises = []
    if ('setAppBadge' in self.navigator) {
		const badgeCount = 69
		const promise = self.navigator.setAppBadge(badgeCount);
		promises.push(promise);
	}
	promises.push(self.registration.showNotification(event.data.text()))
	event.waitUntil(Promise.all(promises));
})

function mimicNotif() {
	const notifLogo = "/img/icons/icon-96x96.png"
	const icon = "Mmic Notif working?"

	const options = {
		body: "Okeeey Letsgooooo",
		icon: "/img/icons/icon-192x192.png",
		badge: "/img/icons/icon-192x192.png",
		image: "/img/icons/icon-192x192.png"

	}

	const promises = []
    if ('setAppBadge' in self.navigator) {
		const badgeCount = 1
		const promise = self.navigator.setAppBadge(badgeCount);
		promises.push(promise);
	}
	promises.push(self.registration.showNotification("INSTAN", options))
	Promise.all(promises)
}