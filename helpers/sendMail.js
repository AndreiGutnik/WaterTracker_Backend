import sgMail from "@sendgrid/mail";
import "dotenv/config";

const { SENDGRID_API_KEY, SENDGRID_MAIL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const msg = { ...data, from: SENDGRID_MAIL };
  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    console.error(error);
  }
};

export default sendEmail;
