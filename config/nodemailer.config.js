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
            Merci pour votre inscription. 
            <br />
            Pour confirmer votre email, cliquez sur le lien suivant:
          </p>
          <a href=${process.env.URL_BACK}:${process.env.PORT}/api/auth/confirm/${confirmationCode}>Cliquez ici</a>
        </div>
      `
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports.sendResetPasswordEmail = async (userId, email, token) => {
  try {
    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: '[bordeaux metropole circulation] RESET',
      html: `
        <div>
          <a href=${process.env.CLIENT_URL}/resetpassword?token=${token}&?user=${userId}>Cliquez ici </a>
        </div>
      `
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports.sendUpdatedPasswordEmail = async (name, email) => {
  try {
    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: '[Circulation BxMetro] RESET',
      html: `
        <div>
          <p>Le mot de passe de ${name} a été mis à jour avec succès.</p>
        </div>
      `
    });
  } catch (error) {
    console.error(error);
  }
};
