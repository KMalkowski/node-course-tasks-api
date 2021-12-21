require('dotenv').config()
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_KEY)

const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'ndftejyiazkezlakam@bvhrs.com',
        subject: 'Thanks for joining',
        text: `Welcome ${name} to my test app.`
    })
}

const sendByeEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'ndftejyiazkezlakam@bvhrs.com',
        subject: 'We are sorry that you leaving',
        text: `Hi ${name}, hope that you will come back to us soon!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendByeEmail
}