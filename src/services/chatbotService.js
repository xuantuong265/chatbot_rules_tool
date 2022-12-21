require("dotenv").config();

import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const callSendAPI = (senderPsid, response) => {
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
        console.log(err);
        console.log(_res);
        if (!err) {
            console.log('Message sent!');
        } else {
            console.error('Unable to send message:' + err);
        }
    });
}

const getUserName = (senderPsid) => {
    return new Promise((resolve, reject) => {
        request({
            'uri': `https://graph.facebook.com/${senderPsid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
            'qs': { 'access_token': PAGE_ACCESS_TOKEN },
            'method': 'GET'
        }, (err, _res, _body) => {
            if (!err) {
                console.log("sfasfjsakf");
                console.log(_res);
                console.log("oke mman");
                _body = JSON.parse(_body);
                console.log(_body);
                const userName = `${_body.last_name} ${_body.first_name}`;
                resolve(userName);
            } else {
                console.log("loi ma may");
                reject(err);
            }
        });
    })
}

const handleGetStarted = (senderPsid) => {
    return new Promise(async(resolve, reject) => {
        try {
            const userName = await getUserName(senderPsid);
            const response = { "text": `Chào mừng ${userName} đến với Demo VKU!` }

            const response1 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        'elements': [{
                            'title': 'Chọn để xem thông tin về điểm của bạn.',
                            'subtitle': 'Tap a button to answer.',
                            "buttons": [{
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_SCORE}/${senderPsid}`,
                                "title": "XEM ĐIỂM",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true //false: open the webview in new tab
                            }, ]
                        }]
                    }
                }
            };

            await callSendAPI(senderPsid, response);
            await callSendAPI(senderPsid, response1);
            resolve("done");
        } catch (error) {
            reject(error);
        }
    })
}

const handleScoreStudent = () => {

}

module.exports = {
    callSendAPI,
    handleGetStarted,
    handleScoreStudent,
    callSendAPI
}