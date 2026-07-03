"use sctrict";

var isGmod = false;
var isTest = false;
var totalFiles = 50;
var totalCalled = false;
var downloadingFileCalled = false;
var percentage = 0;

/**
 * Gmod Called functions
 */
function GameDetails(
	servername,
	serverurl,
	mapname,
	maxplayers,
	steamid,
	gamemode
) {
	debug("GameDetails called");
	isGmod = true;
	if (!isTest) {
		loadAll();
	}
	loadAvatar(steamid);

	if (Config.title) {
		$("#title").html(Config.title);
	} else {
		$("#title").html(servername);
	}
	$("#title").fadeIn();

	if (Config.enableSteamID) {
		$("#steamid").html(steamid);
	}
	$("#steamid").fadeIn();
	$("#avatar").fadeIn();
	$("#welcome").fadeIn();
	$("#welcome_name").fadeIn();
}

function SetFilesTotal(total) {
	debug("SetFilesTotal called total: " + total);
	totalCalled = true;
	totalFiles = total;
}

function SetFilesNeeded(needed) {
	debug("SetFilesNeeded called needed: " + needed);
	if (totalCalled) {
		var sPercentage = 100 - Math.round((needed / totalFiles) * 100);
		percentage = sPercentage;
		setLoad(sPercentage);
	}
}

var fileCount = 0;
function DownloadingFile(filename) {
	filename = filename.replace("'", "").replace("?", "");
	debug("DownloadingFile called '" + filename + "'");
	downloadingFileCalled = true;
	$("#history").prepend('<div class="history-item">' + filename + "</div>");
	$(".history-item").each(function(i, el) {
		if (i > 10) {
			$(el).remove();
		}
		$(el).css("opacity", "" + 1 - i * 0.1);
	});
}

var allow_increment = true;
function SetStatusChanged(status) {
	debug("SetStatusChanged called '" + status + "'");
	$("#history").prepend('<div class="history-item">' + status + "</div>");
	$(".history-item").each(function(i, el) {
		if (i > 10) {
			$(el).remove();
		}
		$(el).css("opacity", "" + 1 - i * 0.1);
	});
	if (status === "Workshop Complete") {
		allow_increment = false;
		setLoad(80);
	} else if (status === "Client info sent!") {
		allow_increment = false;
		setLoad(95);
	} else if (status === "Starting Lua...") {
		setLoad(100);
	} else {
		if (allow_increment) {
			percentage = percentage + 0.1;
			setLoad(percentage);
		}
	}
}

/**
 * External Functions
 */
async function loadAvatar(steamid) {
	$(".avatar").css(
		"background-image",
		'url("images/noavatar.png")'
	);
	$("#welcome").html('Welcome,');
	try {
		const response = await fetch('https://php-starter-spalishe.wasmer.app/steamapi.php?steamid=' + steamid);

		// Check if the response status is 200-299
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json(); // Parse JSON body
		$("#welcome_name").html(data.name);
		$(".avatar").css(
			"background-image",
			'url(' + data.avatarfull + ')'
		);

	} catch (error) {
		console.error('Failed to fetch data:', error);
	}
}
function loadAll() {
	$("nav").fadeIn();
	$("main").fadeIn();
}
function loadBackground() {
	if (Config.backgroundImages) {
		console.log(Config.backgroundImages[1]);
		$(".background").css(
			"background-image",
			'url("images/' + Config.backgroundImages[Math.floor(Math.random() * Config.backgroundImages.length)] + '")'
		);
	}
}
function setLoad(percentage) {
	debug(percentage + "%");
	$(".overhaul").css("left", percentage + "%");
}
var permanent = false;
function announce(message, ispermanent) {
	if (Config.enableAnnouncements && !permanent) {
		$("#announcement").hide();
		$("#announcement").html(message);
		$("#announcement").fadeIn();
	}
	if (ispermanent) {
		permanent = true;
	}
}
function debug(message) {
	if (Config.enableDebug) {
		console.log(message);
		$("#debug").prepend(message + "<br>");
	}
}

/**
 * Initial function
 */
$(document).ready(function() {
	// load everything in when ready
	loadBackground();

	// print announcement messages every few seconds
	if (
		Config.announceMessages &&
		Config.enableAnnouncements &&
		Config.announcementLength
	) {
		if (Config.announceMessages.length > 0) {
			var i = 0;
			setInterval(function() {
				announce(Config.announceMessages[i]);
				i++;
				if (i > Config.announceMessages.length - 1) {
					i = 0;
				}
			}, Config.announcementLength);
		}
	}

	// if it isn't loaded by gmod load manually
	setTimeout(function() {
		if (!isGmod) {
			debug("No Garry's mod testing..");
			isTest = true;
			loadAll();

			GameDetails(
				"Servername",
				"Serverurl",
				"Mapname",
				"Maxplayers",
				"SteamID",
				"Gamemode"
			);
			loadAvatar(0);

			var totalTestFiles = 100;
			SetFilesTotal(totalTestFiles);

			var needed = totalTestFiles;
			setInterval(function() {
				if (needed > 0) {
					needed = needed - 1;
					SetFilesNeeded(needed);
					DownloadingFile("Filename " + needed);
				}
			}, 500);

			SetStatusChanged("Testing..");
		}
	}, 1000);
});
