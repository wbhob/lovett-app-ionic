var admobid = {};
if (/(android)/i.test(navigator.userAgent)) {
	admobid = { // for Android
		banner: 'ca-app-pub-6751533505322787/8431480149',
		interstitial: 'ca-app-pub-6751533505322787/4532438943'
	};
} else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
	admobid = { // for iOS
		banner: 'ca-app-pub-6751533505322787/8571080940',
		interstitial: 'ca-app-pub-6751533505322787/3055705745'
	};
} else {
	admobid = { // for Windows Phone
		banner: 'ca-app-pub-6869992474017983/8878394753',
		interstitial: 'ca-app-pub-6869992474017983/1355127956'
	};
}

if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
	document.addEventListener('deviceready', initApp, false);
} else {
	initApp();
}

function initApp() {
	if (!AdMob) {
		alert('admob plugin not ready');
		return;
	}

	AdMob.createBanner({
		adId: admobid.banner,
		isTesting: false,
		overlap: false,
		offsetTopBar: false,
		position: AdMob.AD_POSITION.BOTTOM_CENTER,
		bgColor: 'black',
		autoShow: true,
		success: function() {
			console.log("YEET!")
		},
		error: function() {
			console.log("DAMMIT!")
		}
	}, console.log("Created"));
	AdMob.showBanner(8);
	AdMob.prepareInterstitial({
		adId: admobid.interstitial,
		autoShow: false
	});
}
