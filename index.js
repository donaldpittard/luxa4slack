require('dotenv').config();
const Log = require('log');
const Luxafor = require('luxafor-api');
const LUX_CONFIG = require('./luxafor-config');
const RtmClient = require('@slack/client').RtmClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const token = process.env.SLACK_API_TOKEN || '';
const rtm = new RtmClient(token, {logLevel: 'none'});

var log = new Log(process.env.LOG || 'luxa4slack');
var device = new Luxafor();

device.setColor(LUX_CONFIG.green);

rtm.start();

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
    if (message.user !== process.env.SLACK_USER) {
        device.fadeTo(LUX_CONFIG.blue);
    } else {
        device.fadeTo(LUX_CONFIG.green);
    }
});

rtm.on(RTM_EVENTS.PRESENCE_CHANGE, function (presenceChangeEvent) {
    if (presenceChangeEvent.user === process.env.SLACK_USER) {
        if (presenceChangeEvent.presence === 'away') {
            device.fadeTo(LUX_CONFIG.yellow);
        } else if (presenceChangeEvent.presence === 'active') {
            device.fadeTo(LUX_CONFIG.green);
        }
    }
});

rtm.on(RTM_EVENTS.DND_UPDATED, function (dndUpdatedEvent) {
    if (dndUpdatedEvent.user === process.env.SLACK_USER) {
        if (dndUpdatedEvent.dnd_status.dnd_enabled) {
            device.fadeTo(LUX_CONFIG.red);
        } else {
            device.fadeTo(LUX_CONFIG.green);
        }
    }
});