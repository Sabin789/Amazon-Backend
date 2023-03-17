import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SG_MAIL_KEY)
export const sendRegistrationEmail=()=>{
  const msg={
    to:recipientAddress,
    from:process.env.USER_EMAIL,
    text:"sdxc",
    html:"<strong>Hello</strong>"
  }
  await sgMail.send(msg)
}