import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const OUR_SITE = 'https://goit-wallet-grupa-03-frontend.vercel.app';
const EMOJI_SMILE = '😃';
const MONEY_EMOJI = '💰';

export const sendMail = (email, name) =>
  sgMail.send({
    to: email,
    from: 'immarcini@gmail.com',
    subject: 'Welcome to Your Personal Wallet!',
    text: `Hello ${name},\n\nWelcome to our money management platform! You can now start using our application to effectively manage your finances ${MONEY_EMOJI}. If you have any questions or need assistance, don't hesitate to reach out to our support team.\n\nBest regards,\nYour Quick Buck Devs\n\nVisit our site: ${OUR_SITE}`,
    html: `
      <html>
        <body>
          <p>Hello ${name} ${EMOJI_SMILE},</p>
          <p>Welcome to our money management platform! You can now start using our application to effectively manage your finances ${MONEY_EMOJI}. If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
          <p>Visit our site: <a href="${OUR_SITE}" target="_blank" rel="noopener noreferrer">${OUR_SITE}</a></p>
          <p>Best regards,<br>Your Quick Buck Devs</p>
        </body>
      </html>
    `,
  });
