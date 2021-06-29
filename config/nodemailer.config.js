const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

module.exports.sendConfirmationEmail = async (
  name,
  email,
  confirmationCode
) => {
  try {
    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: '[Circulation BxMetro] Vérifiez votre adresse email',
      html: `
        <div>
          <h2 style='text-transform: capitalize'>Bonjour ${name} !</h2>
          <p>
            Merci pour ton inscription. 
            <br />
            Pour confirmer ton email, clique sur le lien suivant:
          </p>
          <a href=${process.env.URL_BACK}:${process.env.PORT}/api/auth/confirm/${confirmationCode}>Cliquez ici</a>
        </div>
      `
    });
  } catch (error) {
    console.error(error);
  }
};
