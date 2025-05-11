import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  const msg = {
    to,
    from: 'criptocoin.investments@gmail.com', // deve essere verificato su SendGrid
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`📧 Email inviata a ${to}`);
  } catch (error) {
    console.error('❌ Errore durante l\'invio email:');

    // Log completo dell'errore
    console.error(error.message);

    // Se SendGrid fornisce una risposta dettagliata
    if (error.response?.body) {
      console.error('📩 Dettaglio errore SendGrid:', JSON.stringify(error.response.body, null, 2));
    }
  }
};

export default sendEmail;