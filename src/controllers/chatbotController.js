require("dotenv").config();
import request from "request";
const { NlpManager } = require("node-nlp");
const manager = new NlpManager({ languages: ["en"] });
manager.load();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const getHomePage = (req, res) => {
    return res.send("heeleo em bahy em");
};

const postWebhook = (req, res) => {
    let body = req.body;

    // Checks if this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the body of the webhook event
            let webhookEvent = entry.messaging[0];
            console.log(webhookEvent);

            // Get the sender PSID
            let senderPsid = webhookEvent.sender.id;
            console.log('Sender PSID: ' + senderPsid);

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

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};

// Handles messaging_postbacks events
function handlePostback(senderPsid, receivedPostback) {
    let response;

    // Get the payload for the postback
    let payload = receivedPostback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { 'text': 'Thanks!' };
    } else if (payload === 'no') {
        response = { 'text': 'Oops, try sending another image.' };
    }
    // Send the message to acknowledge the postback
    callSendAPI(senderPsid, response);
}

// Sends response messages via the Send API
function callSendAPI(senderPsid, response) {
    // Construct the message body
    let requestBody = {
        'recipient': {
            'id': senderPsid
        },
        'message': response
    };

    // Send the HTTP request to the Messenger Platform
    request({
        'uri': 'https://graph.facebook.com/v2.6/me/messages',
        'qs': { 'access_token': PAGE_ACCESS_TOKEN },
        'method': 'POST',
        'json': requestBody
    }, (err, _res, _body) => {
        if (!err) {
            console.log('Message sent!');
        } else {
            console.error('Unable to send message:' + err);
        }
    });
}

// Handles messages events
async function handleMessage(senderPsid, receivedMessage) {

    console.log(receivedMessage.text + "-----------");

    let response;
    let message = await handleMessageNPL(receivedMessage);

    // Checks if the message contains text
    if (receivedMessage.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of your request to the Send API
        console.log("hihih: " + response);
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
    callSendAPI(senderPsid, response);
}

async function handleMessageNPL(receivedMessage) {
    // const dock = await dockStart({ use: ['Basic'] });
    // const nlp = dock.get('nlp');
    // nlp.addLanguage('en');
    // // Adds the utterances and intents for the NLP
    // nlp.addDocument('en', 'goodbye for now', 'greetings.bye');
    // nlp.addDocument('en', 'bye bye take care', 'greetings.bye');
    // nlp.addDocument('en', 'okay see you later', 'greetings.bye');
    // nlp.addDocument('en', 'bye for now', 'greetings.bye');
    // nlp.addDocument('en', 'i must go', 'greetings.bye');
    // nlp.addDocument('en', 'hello', 'greetings.hello');
    // nlp.addDocument('en', 'hi', 'greetings.hello');
    // nlp.addDocument('en', 'howdy', 'greetings.hello');

    // // Train also the NLG
    // nlp.addAnswer('en', 'greetings.bye', 'Till next time');
    // nlp.addAnswer('en', 'greetings.bye', 'see you soon!');
    // nlp.addAnswer('en', 'greetings.hello', 'Hey there!');
    // nlp.addAnswer('en', 'greetings.hello', 'Greetings!');
    // await nlp.train();
    // const response = await nlp.process('en', receivedMessage.text);


    const response = await manager.process("en", receivedMessage.text);
    return response.answer;
}

module.exports = {
    getHomePage,
    getWebhook,
    postWebhook
}