const sgMail = require('@sendgrid/mail');
const config = require('config');
const dotenv = require('dotenv')
dotenv.config();

function mailService ( to, subject, html) {
    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to,
        from: 'gchat.myapp@gmail.com',
        subject,
        html,
        };

    sgMail.send(msg).then(() => {
        console.log("successful");
        
    }).catch((err) => console.log("err", err)
    )

}

exports.mailService = mailService;
