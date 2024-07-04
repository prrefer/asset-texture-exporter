const textureRbxmxRegex = /(?<!"MeshId">)<url>http:\/\/www\.roblox\.com\/asset\/\?id=(\d+)/
const textureRbmxRegex = /TextureId.+\/(?:\?id=)?(\d+)/

function downloadTexture(textureId) {
	fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${textureId}&returnPolicy=PlaceHolder&size=700x700&format=Png&isCircular=false`).then(response => response.json()).then(response => {
		const textureUrl = response.data[0].imageUrl
		chrome.downloads.download({
			url: textureUrl,
			filename: `${textureId}.png`
		})
	})
}

chrome.action.onClicked.addListener(tab => {
	if (!tab.url.startsWith("https://www.roblox.com/catalog/")) return
	
	const assetId = tab.url.split("/")[4]
	if (!assetId) return

	fetch(`https://assetdelivery.roblox.com/v1/asset/?id=${assetId}`).then(response => {
		fetch(response.url).then(response => response.text()).then(response => {
			let textureData = response.match(textureRbxmxRegex)
			if (!textureData) {
				textureData = response.match(textureRbmxRegex) // Seperated into different regex checks because the OR (|) operator in the regex would not work for some reason
				if (!textureData) return
			}

			let textureId = textureData[1]
			console.log(textureId)
			downloadTexture(textureId)
		})
	})
})
