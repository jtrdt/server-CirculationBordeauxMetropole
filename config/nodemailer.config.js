const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  try {
    transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'Please confirm your account',
      html: `<h1>Email de confirmation</h1>
          <h2>Bonjour ${name} !</h2>
          <p>Merci pour ton inscription. Merci de confirmer ton email en cliquant sur le lien suivant.</p>
          <a href=http://localhost:8000/api/auth/confirm/${confirmationCode}>Cliquez ici</a>
          </div>`
    });
  } catch (error) {
    console.error(error);
  }
};
