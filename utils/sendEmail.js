import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'

dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async ({ to, subject, text, html }) => {
  const msg = {
    to,
    from: 'criptocoin.investments@gmail.com', // mittente verificato in SendGrid
    subject,
    text,
    html,
  }

  try {
    await sgMail.send(msg)
    console.log(`Email inviata a ${to}`)
  } catch (error) {
    console.error('Errore invio email:', error)
    if (error.response) {
      console.error(error.response.body)
    }
  }
}

export default sendEmail
