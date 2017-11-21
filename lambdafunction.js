/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');
const https = require("https");
const APP_ID = undefined;

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Georgia Tech Unofficial Buildings',
            GET_FACT_MESSAGE: "Here's the building address: ",
            HELP_MESSAGE: 'You can say what is the address for a building or you can say exit... What can I help you find?',
            HELP_REPROMPT: 'What can I help you find?',
            STOP_MESSAGE: 'Goodbye!',
        },
    },
    'en-US': {
        translation: {
            SKILL_NAME: 'Georgia Tech Unofficial Buildings'
        },
    }
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetBuilding');
    },
    'GetBuildingAddress': function () {
        this.emit('GetBuilding');
    },
    'GetBuilding': function () {
        // Use this.t() to get corresponding language data
        var itemSlot = this.event.request.intent.slots.BuildingName;
        var itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }
        
        var buildings = this.t("BUILDINGS");
        var address = buildings[itemName];

        const url =
          "https://m.gatech.edu/api/gtplaces/buildings/" + itemName;
          
            https.get(url, res => {
              res.setEncoding("utf8");
              let body = "";
              res.on("data", data => {
                body += data;
              });
              res.on("end", () => {
                body = JSON.parse(body);
                this.emit(':tellWithCard', body[0].address, itemSlot.value, body[0].address);
              });

            });
        // Create speech output
       // this.emit(':tellWithCard', address, this.t('SKILL_NAME'), address);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
