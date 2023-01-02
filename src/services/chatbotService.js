require("dotenv").config();

import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const URL_WEB_SERVER_CHATBOT = process.env.URL_WEB_SERVER_CHATBOT;

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
            // const userName = await getUserName(senderPsid);
            const response = { "text": `Chào mừng bạn đến với Demo VKU!` }

            await callSendAPI(senderPsid, response);
            resolve("done");
        } catch (error) {
            reject(error);
        }
    })
}

const showMessageScore = (senderPsid) => {
    return new Promise(async(resolve, reject) => {
        try {
            const url = `${process.env.URL_WEB_VIEW_SCORE}/${senderPsid}`;
            const response = templateMessage(url, "XEM ĐIỂM")

            await callSendAPI(senderPsid, response);
            resolve("done");
        } catch (error) {
            reject(error);
        }
    })
}

const showMessageLearnRest = (senderPsid) => {
    return new Promise(async(resolve, reject) => {
        try {
            const url = `${URL_WEB_SERVER_CHATBOT}/learn-rest/${senderPsid}`;
            const response = templateMessage(url, "CÁC MÔN ĐÃ HỌC")

            await callSendAPI(senderPsid, response);
            resolve("done");
        } catch (error) {
            reject(error);
        }
    })
}

const showMessageSubjectStuding = (senderPsid) => {
    return new Promise(async(resolve, reject) => {
        try {
            const url = `${URL_WEB_SERVER_CHATBOT}/subject-studing/${senderPsid}`;
            const response = templateMessage(url, "CÁC MÔN ĐANG HỌC")

            await callSendAPI(senderPsid, response);
            resolve("done");
        } catch (error) {
            reject(error);
        }
    })
}

const showMessageUnlearnedSubjects = (senderPsid) => {
    return new Promise(async(resolve, reject) => {
        try {
            const url = `${URL_WEB_SERVER_CHATBOT}/unlearned-subjects/${senderPsid}`;
            const response = templateMessage(url, "CÁC MÔN CHƯA HỌC")

            await callSendAPI(senderPsid, response);
            resolve("done");
        } catch (error) {
            reject(error);
        }
    })
}

const showMessageDebtCourses = (senderPsid) => {
    return new Promise(async(resolve, reject) => {
        try {
            const url = `${URL_WEB_SERVER_CHATBOT}/debt-courses/${senderPsid}`;
            const response = templateMessage(url, "CÁC MÔN NỢ")

            await callSendAPI(senderPsid, response);
            resolve("done");
        } catch (error) {
            reject(error);
        }
    })
}

const showMessageTotalTuitionFee = (senderPsid) => {
    return new Promise(async(resolve, reject) => {
        try {
            const url = `${URL_WEB_SERVER_CHATBOT}/total-tuition-fee/${senderPsid}`;
            const response = templateMessage(url, "TỔNG HỌC PHÍ")

            await callSendAPI(senderPsid, response);
            resolve("done");
        } catch (error) {
            reject(error);
        }
    })
}

const showMessageUnpaidTuitionFees = (senderPsid) => {
    return new Promise(async(resolve, reject) => {
        try {
            const url = `${URL_WEB_SERVER_CHATBOT}/unpaid-tuition-fees/${senderPsid}`;
            const response = templateMessage(url, "HỌC PHÍ CHƯA NỘP")

            await callSendAPI(senderPsid, response);
            resolve("done");
        } catch (error) {
            reject(error);
        }
    })
}

const showMessageTuitionFeePaid = (senderPsid) => {
    return new Promise(async(resolve, reject) => {
        try {
            const url = `${URL_WEB_SERVER_CHATBOT}/tuition-fee-paid/${senderPsid}`;
            const response = templateMessage(url, "HỌC PHÍ ĐÃ NỘP")

            await callSendAPI(senderPsid, response);
            resolve("done");
        } catch (error) {
            reject(error);
        }
    })
}

const showMessageUnpaidCourseFees = (senderPsid) => {
    return new Promise(async(resolve, reject) => {
        try {
            const url = `${URL_WEB_SERVER_CHATBOT}/unpaid-course-fees/${senderPsid}`;
            const response = templateMessage(url, "HỌC PHÍ THEO MÔN CHƯA ĐÓNG")

            await callSendAPI(senderPsid, response);
            resolve("done");
        } catch (error) {
            reject(error);
        }
    })
}

const showMessageSemestersFees = (senderPsid) => {
    return new Promise(async(resolve, reject) => {
        try {
            const url = `${URL_WEB_SERVER_CHATBOT}/semester-fee/${senderPsid}`;
            const response = templateMessage(url, "HỌC PHÍ THEO KỲ")

            await callSendAPI(senderPsid, response);
            resolve("done");
        } catch (error) {
            reject(error);
        }
    })
}

const templateMessage = (url, title) => {
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                'elements': [{
                    'title': 'Chọn để  nhập thông tin của bạn.',
                    "buttons": [{
                        "type": "web_url",
                        "url": url,
                        "title": title,
                        "webview_height_ratio": "tall",
                        "messenger_extensions": true //false: open the webview in new tab
                    }, ]
                }]
            }
        }
    };
}

module.exports = {
    callSendAPI,
    handleGetStarted,
    showMessageScore,
    showMessageLearnRest,
    showMessageSubjectStuding,
    showMessageUnlearnedSubjects,
    showMessageDebtCourses,
    showMessageTotalTuitionFee,
    showMessageTuitionFeePaid,
    showMessageUnpaidTuitionFees,
    showMessageUnpaidCourseFees,
    showMessageSemestersFees
}