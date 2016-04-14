var SteamCommunity = require('steamcommunity');
var SteamTotp = require("steam-totp");
var steam = new SteamCommunity();
var TradeOfferManager = require('steam-tradeoffer-manager');
var manager = new TradeOfferManager({
  "domain": "charredgrass.github.io", //for api key uses
  "language": "en",
  "pollInterval": 30000
});

var logOnOptions = {
	'accountName': "CharredBot04",
	'password': "myPasswordGoesHere",
	'twoFactorCode': SteamTotp.generateAuthCode("cnOgv/KdpLoP6Nbh0GMkXkPXALQ="); //this line and the comma before it can be removed if you don't have mobile auth enabled, but I'm assuming you do if you plan to trade
};

var identitySecret = "";

//logs in via browser
steam.login(logOnOptions, function(err, sessionID, cookies, steamguard) {
	if (err) {
		console.log("There was an error logging in! Error details: " + err.message);
		process.exit(1); //terminates program
	} else {
		console.log("Successfully logged in as " + logOnOptions.accountName);
		steam.chatLogon();
		manager.setCookies(cookies, function(err) {
			if (err) {
				console.log(err);
				process.exit(1);
			}
		});
	}
	steam.startConfirmationChecker(10000, identitySecret); //Auto-confirmation enabled!
});

manager.on('newOffer', processTrade);

function processTrade(offer) {
	console.log("New trade from " + offer.partner);
	offer.accept(function(err) {
		if (err) {
			console.log("Error accepting offer: " + err.message);
		} else {
			console.log("Successfully accepted an offer.");
		}
	})
}
