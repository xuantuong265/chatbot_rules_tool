const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "xuantuong265@gmail.com", // generated ethereal user
        pass: "tjhmmnzookxnbymu", // generated ethereal password
    },
});

const sendEmail = async(email, data) => {

    let scores = "";
    data.score.forEach(element => {
        scores += `
                <tr>
                    <td>${element.subject}</td>
                    <td>${element.attendance}</td>
                    <td>${element.homeword}</td>
                    <td>${element.midterm_score}</td>
                    <td>${element.term_end_point}</td
                    </td> 
                </tr>
       `;
    });


    const temp = `<!DOCTYPE html>
                <html>
                <head>
                <meta charset="utf-8">
                <meta http-equiv="x-ua-compatible" content="ie=edge">
                <title>Welcome Email</title>
                </head>
                <body>
                    <h1 style="text-align=center">Bảng điểm của bạn</h1>
                    <table class="table table-striped table-valign-middle">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Chuyên cần</th>
                                    <th>Bài tập về nhà </th>
                                    <th>Giữa kỳ</th>
                                    <th>Cuối kỳ</th>
                                    <th>Tổng kết</th>  
                                </tr>
                            </thead>
                            <tbody>
                                ${scores}
                            </tbody>
                        </table>
                </body>
                </html>
            `;

    await transporter.sendMail({
        from: '"VKU 👻" <xuantuong265@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Bảng điểm ✔", // Subject line
        text: "Hello ssfsa?", // plain text body
        html: temp, // html body
    });
}

module.exports = {
    sendEmail
}