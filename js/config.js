// ignore
var Config = {};

/**
 * What should the text in the center of the screen be?
 * if empty it will fill in your Server Name
 */
Config.title = "";

/**
 * Enable map text in the top left corner of the screen?
 */
Config.enableMap = true;

/**
 * Enable steamId text in the top right corner of the screen?
 */
Config.enableSteamID = true;

/**
 * Enable announcements?
 */
Config.enableAnnouncements = true;

/**
 * What messages do you want to show up?
 * only works if enableAnnouncements = true
 */
Config.announceMessages = [
	"This server was built with help of @spalishe",
	"Tip: Enjoy you stay."
];

/**
 * How many miliseconds for each announcement?
 * only works if enableAnnouncements = true
 */
Config.announcementLength = 15000;

/**
 * Image Filename
 * DROP IMAGE IN "images" FOLDER
 */
Config.backgroundImages = [
	"background.png",
];

/**
 * Enable debug messages?
 */
Config.enableDebug = false;
