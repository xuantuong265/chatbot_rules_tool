require("dotenv").config();
import res from "express/lib/response";
import request from "request";
const { NlpManager } = require("node-nlp");
const manager = new NlpManager({ languages: ["en"] });
manager.load();

import chatbotService from "../services/chatbotService";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const getHomePage = (req, res) => {
    return res.send("heeleo em bahy em");
};

const trainChatbot = (req, res) => {
    trainNLP()

    return res.status(500).json({ message: 'thanh cong' })
};

const setupProfile = (req, res) => {
    // let requestBody = {
    //     "get_started": { "payload": "GET_STARTED" },
    //     "whitelisted_domains": ["https://chatbot-rules-tool.onrender.com"]
    // }

    // request({
    //     'uri': `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
    //     'qs': { 'access_token': PAGE_ACCESS_TOKEN },
    //     'method': 'POST',
    //     'json': requestBody
    // }, (err, _res, _body) => {
    //     console.log(_body);
    //     if (!err) {
    //         console.log('success!');
    //     } else {
    //         console.error('Unable to send message:' + err);
    //     }
    // });
}

const postWebhook = (req, res) => {
    let body = req.body;

    // Checks if this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the body of the webhook event
            let webhookEvent = entry.messaging[0];

            // Get the sender PSID
            let senderPsid = webhookEvent.sender.id;

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhookEvent.message) {
                handleMessage(senderPsid, webhookEvent.message);
            } else if (webhookEvent.postback) {
                handlePostback(senderPsid, webhookEvent.postback);
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {

        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

const getWebhook = (req, res) => {
    // Your verify token. Should be a random string.
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};

const handleScoreTable = (req, res) => {
    const senderID = req.params.senderId;

    return res.render("score-table.ejs", {
        senderID: "387523857"
    });
}

const handlePostScoreTable = async(req, res) => {
    try {
        let response1 = {
            "text": `---Info about your lookup order---
            \nCustomer name: ${req.body.customerName}
            \nEmail address: ${req.body.email}
            \nOrder number: ${req.body.orderNumber}
            `
        };

        await chatbotService.callSendAPI(req.body.psid, response1);

        return res.status(200).json({
            message: req.body.psid
        });
    } catch (e) {
        return res.status(500).json({
            message: "error"
        });
    }
}

// Handles messaging_postbacks events
async function handlePostback(senderPsid, receivedPostback) {
    let response;

    // Get the payload for the postback
    let payload = receivedPostback.payload;

    console.log("hello");
    console.log(payload);

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { 'text': 'Thanks!' };
    } else if (payload === 'no') {
        response = { 'text': 'Oops, try sending another image.' };
    } else if (payload == 'GET_STARTED') {
        await chatbotService.handleGetStarted(senderPsid);
    } else if (payload == 'SCORE') {
        await chatbotService.handleScoreStudent
    }
}

// Handles messages events
async function handleMessage(senderPsid, receivedMessage) {
    let response;
    let message = await handleMessageNPL(receivedMessage);

    if (receivedMessage.text) {
        response = {
            'text': message
        };
    } else if (receivedMessage.attachments) {

        // Get the URL of the message attachment
        let attachmentUrl = receivedMessage.attachments[0].payload.url;
        response = {
            'attachment': {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [{
                        'title': 'Is this the right picture?',
                        'subtitle': 'Tap a button to answer.',
                        'image_url': attachmentUrl,
                        'buttons': [{
                                'type': 'postback',
                                'title': 'Yes!',
                                'payload': 'yes',
                            },
                            {
                                'type': 'postback',
                                'title': 'No!',
                                'payload': 'no',
                            }
                        ],
                    }]
                }
            }
        };
    }

    // Send the response message
    chatbotService.callSendAPI(senderPsid, response);
}

async function handleMessageNPL(receivedMessage) {
    const response = await manager.process("en", receivedMessage.text);
    return response.answer;
}

async function trainNLP() {
    manager.addCorpora('src/data/corpus-en.json');
    await manager.train();
    manager.save();
}

module.exports = {
    getHomePage,
    getWebhook,
    postWebhook,
    trainChatbot,
    setupProfile,
    handleScoreTable,
    handlePostScoreTable
}