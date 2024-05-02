const staticCacheName = "site-static-v4"
const dynamicCache = "site-dynamic-v3"
const assets = [
	"/",
	"./index.html",
	"./howto.html",
	"./scripts/libraries/dayjs.min.js",
	"./scripts/libraries/relativeTime.js",
	"./scripts/libraries/uikit-icons.min.js",
	"./scripts/libraries/uikit.min.js",
	"./scripts/libraries/zip-full.min.js",
	"./scripts/createSession.js",
	"./scripts/createTiles.js",
	"./scripts/handleDataIG.js",
	"./scripts/handleSession.js",
	"./scripts/handleUpload.js",
	"./scripts/loadApp.js",
	"./scripts/localStorage.js",
	"./scripts/optionsDropdowns.js",
	"./scripts/userDetailsDOM.js",
	"./scripts/userListDOM.js",
	"./scripts/utilities.js",
	"./styles/uikit.css",
	"./styles/style.css",
	"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
	"https://cdn.jsdelivr.net/npm/chart.js",
	"./img/howto/howto_0.png",
	"./img/howto/howto_1.png",
	"./img/howto/howto_2.png",
	"./img/howto/howto_3.png",
	"./img/howto/howto_4.png",
	"./img/howto/howto_5.png",
	"./img/howto/howto_6.png",
	"./img/howto/howto_7.png",
	"./img/howto/howto_8.png",
	"./img/howto/howto_9.png",
	"./img/howto/howto_10.png",
	"./img/howto/howto_11.png",
	"./img/howto/howto_12.png",
	"./img/icons/launch.png",
	"/img/icons/icon-192x192.png"
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