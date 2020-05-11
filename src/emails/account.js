const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email, name) => {

    const result = await sgMail.send({
        to: email,
        from: 'sachin.sahu@inpixon.com',
        subject: 'Task Application',
        text: `Hello, ${name} how are you!`
    })

}


const deleteUser = async (email, name) => {
    const result = sgMail.send({
        to: email,
        from: 'sachin.sahu@inpixon.com',
        subject: 'Task Application',
        text: `User Account has been deactivated!, ${name}`
    })
}
module.exports = {
    sendEmail,
    deleteUser
}