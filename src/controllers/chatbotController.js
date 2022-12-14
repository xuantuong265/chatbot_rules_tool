require("dotenv").config();
import res, { render } from "express/lib/response";
import request from "request";
const { NlpManager } = require("node-nlp");
const manager = new NlpManager({ languages: ["vi"] });
import axios from 'axios';
const fs = require('fs').promises

import chatbotService from "../services/chatbotService";
import sendmailService from "../services/sendmailService";

const URL_WEB_SERVER = process.env.URL_WEB_SERVER;

const getHomePage = async(req, res) => {
    return res.send("ok");
};

const trainChatbot = async(req, res) => {
    try {
        manager.addCorpora('src/data/corpus-en.json');
        await manager.train();
        manager.save();

        return res.status(200).json({
            message: "oke"
        });
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
};

const writeChatbot = async(req, res) => {
    try {
        const response = await axios.get(`${URL_WEB_SERVER}/api`);
        await fs.writeFile('src/data/corpus-en.json', JSON.stringify(response.data), (err) => {});

        return res.status(200).json({
            message: "oke"
        });
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
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
    const senderID = req.params.senderID;

    return res.render("score-table.ejs", {
        senderID: senderID
    });
}

const handlePostScoreTable = async(req, res) => {
    try {
        let response1 = {
            "text": `B???n ki???m tra email ????? xem ??i???m.`
        };

        let email = req.body.email;
        let masv = req.body.masv;

        const response = await axios.get(`${URL_WEB_SERVER}/showapi?code=${masv}&email=${email}`);

        if (response.data.length == 0) {
            response1 = {
                "text": "B???n cung c???p sai, vui l??ng nh???p l???i."
            };
            await chatbotService.callSendAPI(req.body.psid, response1);
        } else {
            await chatbotService.callSendAPI(req.body.psid, response1);
            await sendmailService.sendEmail(email, response.data);
        }

        return res.status(200).json({
            message: "ok"
        });
    } catch (e) {
        return res.status(500).json({
            message: e
        });
    }
}

const handleLearnRest = (req, res) => {
    const senderID = req.params.senderID;

    return res.render("learn-rest.ejs", {
        senderID: senderID
    });
}

const handlePostLearnRest = async(req, res) => {
    try {
        let masv = req.body.masv;
        let message = {
            "text": "B???n cung c???p sai, vui l??ng nh???p l???i."
        };

        const response = await axios.get(`${URL_WEB_SERVER}/mondahoc?code=${masv}`);

        if (response.data.length > 0) {
            let subject = "";
            response.data.forEach(element => {
                subject += " " + `${element.mon}`
            });

            message = {
                "text": `C??c m??n ???? h???c c???a b???n: \n` +
                    `${subject}`
            };
        }

        await chatbotService.callSendAPI(req.body.psid, message);

        return res.status(200).json({
            message: "ok"
        });
    } catch (e) {
        return res.status(500).json({
            message: e
        });
    }
}

const handleSubjectStuding = (req, res) => {
    const senderID = req.params.senderID;

    return res.render("subject-studing.ejs", {
        senderID: senderID
    });
}

const handlePostSubjectStuding = async(req, res) => {
    try {
        let masv = req.body.masv;
        let message = {
            "text": "B???n cung c???p sai, vui l??ng nh???p l???i."
        };

        const response = await axios.get(`${URL_WEB_SERVER}/mondanghoc?code=${masv}`);

        if (response.data.length > 0) {
            let subject = "";
            response.data.forEach(element => {
                subject += ", " + `${element.mon}`
            });

            message = {
                "text": `C??c m??n ??ang h???c c???a b???n: \n` +
                    `${subject}`
            };
        }

        await chatbotService.callSendAPI(req.body.psid, message);

        return res.status(200).json({
            message: "ok"
        });
    } catch (e) {
        return res.status(500).json({
            message: e
        });
    }
}

const handleUnlearnedSubjects = (req, res) => {
    const senderID = req.params.senderID;

    return res.render("unlearn-studing.ejs", {
        senderID: senderID
    });
}

const handlePostUnlearnedSubjects = async(req, res) => {
    try {
        let masv = req.body.masv;
        let message = {
            "text": "B???n cung c???p sai, vui l??ng nh???p l???i."
        };

        const response = await axios.get(`${URL_WEB_SERVER}/monchuahoc?code=${masv}`);

        if (response.data.length > 0) {
            let subject = "";
            response.data.forEach(element => {
                subject += ", " + `${element.mon}`
            });

            message = {
                "text": `C??c m??n chua h???c c???a b???n: \n` +
                    `${subject}`
            };
        }

        await chatbotService.callSendAPI(req.body.psid, message);

        return res.status(200).json({
            message: "ok"
        });
    } catch (e) {
        return res.status(500).json({
            message: e
        });
    }
}

const handleDebtCourses = (req, res) => {
    const senderID = req.params.senderID;

    return res.render("debt-courses.ejs", {
        senderID: senderID
    });
}

const handlePostDebtCourses = async(req, res) => {
    try {
        let masv = req.body.masv;
        let message = {
            "text": "B???n cung c???p sai, vui l??ng nh???p l???i."
        };

        const response = await axios.get(`${URL_WEB_SERVER}/monno?code=${masv}`);

        if (response.data.length > 0) {
            let subject = "";
            response.data.forEach(element => {
                subject += ", " + `${element.mon}`
            });

            message = {
                "text": `C??c m??n h???c n??? c???a b???n: \n` +
                    `${subject}`
            };
        }

        await chatbotService.callSendAPI(req.body.psid, message);

        return res.status(200).json({
            message: "ok"
        });
    } catch (e) {
        return res.status(500).json({
            message: e
        });
    }
}

const handleTotalTuitionFee = (req, res) => {
    const senderID = req.params.senderID;

    return res.render("total-tuition-fee.ejs", {
        senderID: senderID
    });
}

const handlePostTotalTuitionFee = async(req, res) => {
    try {
        let masv = req.body.masv;
        let message = {
            "text": "B???n cung c???p sai, vui l??ng nh???p l???i."
        };

        const response = await axios.get(`${URL_WEB_SERVER}/tonghocphi?code=${masv}`);

        if (Object.keys(response.data).length > 0) {
            const hocphi = response.data.tonghocphi.toLocaleString('vi', { style: 'currency', currency: 'VND' });

            message = {
                "text": `T???ng h???c ph?? c???a sinh vi??n: ${response.data.sinhvien}  l??: ${hocphi}`
            };
        }

        await chatbotService.callSendAPI(req.body.psid, message);

        return res.status(200).json({
            message: "ok"
        });
    } catch (e) {
        return res.status(500).json({
            message: e
        });
    }
}

const handleUnpaidTuitionFees = (req, res) => {
    const senderID = req.params.senderID;

    return res.render("unpaid-tuition-fee.ejs", {
        senderID: senderID
    });
}

const handlePostUnpaidTuitionFees = async(req, res) => {
    try {
        let masv = req.body.masv;
        let message = {
            "text": "B???n cung c???p sai, vui l??ng nh???p l???i."
        };

        const response = await axios.get(`${URL_WEB_SERVER}/hocphichuanop?code=${masv}`);
        if (Object.keys(response.data).length > 0) {
            const hocphi = response.data.hocphichuanop.toLocaleString('vi', { style: 'currency', currency: 'VND' });

            message = {
                "text": `T???ng h???c ph?? ch??a n???p c???a sinh vi??n: ${response.data.sinhvien}  l??: ${hocphi}`
            };
        }

        await chatbotService.callSendAPI(req.body.psid, message);

        return res.status(200).json({
            message: "ok"
        });
    } catch (e) {
        return res.status(500).json({
            message: e
        });
    }
}

const handleTuitionFeePaid = (req, res) => {
    const senderID = req.params.senderID;

    return res.render("tuition-fee.ejs", {
        senderID: senderID
    });
}

const handlePostTuitionFeePaid = async(req, res) => {
    try {
        let masv = req.body.masv;
        let message = {
            "text": "B???n cung c???p sai, vui l??ng nh???p l???i."
        };

        const response = await axios.get(`${URL_WEB_SERVER}/hocphidanop?code=${masv}`);
        if (Object.keys(response.data).length > 0) {
            const hocphi = response.data.hocphidanop.toLocaleString('vi', { style: 'currency', currency: 'VND' });

            message = {
                "text": `T???ng h???c ph?? ???? n???p c???a sinh vi??n: ${response.data.sinhvien}  l??: ${hocphi}`
            };
        }

        await chatbotService.callSendAPI(req.body.psid, message);

        return res.status(200).json({
            message: "ok"
        });
    } catch (e) {
        return res.status(500).json({
            message: e
        });
    }
}

const handleUnpaidCourseFees = (req, res) => {
    const senderID = req.params.senderID;

    return res.render("unpaid-course-fee.ejs", {
        senderID: senderID
    });
}

const handlePostUnpaidCourseFees = async(req, res) => {
    try {
        let masv = req.body.masv;
        let message = {
            "text": "B???n cung c???p sai, vui l??ng nh???p l???i."
        };

        const response = await axios.get(`${URL_WEB_SERVER}/hocphitheomonchuadong?code=${masv}`);
        if (response.data.length > 0) {
            let subject = "";
            response.data.forEach(element => {
                const hocphi = element.hocphi.toLocaleString('vi', { style: 'currency', currency: 'VND' });
                subject += `M??n h???c: ${element.mon}, h???c ph??: ${hocphi} \n`
            });

            message = {
                "text": `Nh??ng m??n ch??a ????ng h???c ph??: \n ${subject}`
            };
        }

        await chatbotService.callSendAPI(req.body.psid, message);

        return res.status(200).json({
            message: "ok"
        });
    } catch (e) {
        return res.status(500).json({
            message: e
        });
    }
}

const handleSemestersFees = (req, res) => {
    const senderID = req.params.senderID;

    return res.render("semester-fee.ejs", {
        senderID: senderID
    });
}

const handlePostSemestersFees = async(req, res) => {
    try {
        let masv = req.body.masv;
        let message = {
            "text": "B???n cung c???p sai, vui l??ng nh???p l???i."
        };

        const response = await axios.get(`${URL_WEB_SERVER}/hocphitheoki?code=${masv}`);
        if (response.data.length > 0) {
            let subject = "";
            response.data.forEach(element => {
                const hocphi = element.tongtien.toLocaleString('vi', { style: 'currency', currency: 'VND' });
                subject += `H???c k??: ${element.hocki}, ni??n kh??a: ${element.nienkhoa} ,h???c ph??: ${hocphi} \n`
            });

            message = {
                "text": `H???c ph?? theo t???ng h???c k??: \n ${subject}`
            };
        }

        await chatbotService.callSendAPI(req.body.psid, message);

        return res.status(200).json({
            message: "ok"
        });
    } catch (e) {
        return res.status(500).json({
            message: e
        });
    }
}

// Handles messaging_postbacks events
async function handlePostback(senderPsid, receivedPostback) {
    let response;

    // Get the payload for the postback
    let payload = receivedPostback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { 'text': 'Thanks!' };
    } else if (payload === 'no') {
        response = { 'text': 'Oops, try sending another image.' };
    } else if (payload == 'GET_STARTED') {
        await chatbotService.handleGetStarted(senderPsid);
    }
}

// Handles messages events
async function handleMessage(senderPsid, receivedMessage) {
    let response;
    let message = await handleMessageNPL(receivedMessage, senderPsid);

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

async function handleMessageNPL(receivedMessage, senderPsid) {
    manager.load();
    const response = await manager.process("vi", receivedMessage.text);
    if (response.answers.length == 0) {
        return 'Xin l???i, t??i kh??ng hi???u c??u h???i c???a b???n.';
    } else if (response.intent == "agent.score") {
        await chatbotService.showMessageScore(senderPsid)
    } else if (response.intent == "agent.mondahoc") {
        await chatbotService.showMessageLearnRest(senderPsid)
    } else if (response.intent == "agent.mondanghoc") {
        await chatbotService.showMessageSubjectStuding(senderPsid)
    } else if (response.intent == "agent.monchuahoc") {
        await chatbotService.showMessageUnlearnedSubjects(senderPsid)
    } else if (response.intent == "agent.monno") {
        await chatbotService.showMessageDebtCourses(senderPsid)
    } else if (response.intent == "agent.tonghocphi") {
        await chatbotService.showMessageTotalTuitionFee(senderPsid)
    } else if (response.intent == "agent.hocphidanop") {
        await chatbotService.showMessageTuitionFeePaid(senderPsid)
    } else if (response.intent == "agent.hocphichuanop") {
        await chatbotService.showMessageUnpaidTuitionFees(senderPsid)
    } else if (response.intent == "agent.hocphitheomonchuadong") {
        await chatbotService.showMessageUnpaidCourseFees(senderPsid)
    } else if (response.intent == "agent.hocphitheoki") {
        await chatbotService.showMessageSemestersFees(senderPsid)
    }
    return response.answer;
}

module.exports = {
    getHomePage,
    getWebhook,
    postWebhook,
    trainChatbot,
    setupProfile,
    handleScoreTable,
    handlePostScoreTable,
    handleLearnRest,
    handlePostLearnRest,
    writeChatbot,
    handleSubjectStuding,
    handlePostSubjectStuding,
    handleUnlearnedSubjects,
    handlePostUnlearnedSubjects,
    handleDebtCourses,
    handlePostDebtCourses,
    handleTotalTuitionFee,
    handlePostTotalTuitionFee,
    handleUnpaidTuitionFees,
    handlePostUnpaidTuitionFees,
    handleTuitionFeePaid,
    handlePostTuitionFeePaid,
    handleUnpaidCourseFees,
    handlePostUnpaidCourseFees,
    handleSemestersFees,
    handlePostSemestersFees
}