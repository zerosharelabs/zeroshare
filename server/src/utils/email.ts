import nodemailer from "nodemailer";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import * as openpgp from "openpgp";

const MAIL_FROM = '"Pablo from ZeroShare" <hello@zeroshare.io>';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "mail.smtp2go.com",
  port: Number(process.env.SMTP_PORT) ?? 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER ?? "username",
    pass: process.env.SMTP_PASSWORD ?? "password",
  },
});

const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html: string
) => {
  try {
    await transporter.sendMail({ from: MAIL_FROM, to, subject, text, html });
  } catch {}
};

export const sendUserInvitation = async ({
  to,
  from,
  inviteLink,
}: {
  to: string;
  from: string;
  inviteLink: string;
}) => {
  await sendMail(
    to,
    "You're invited to join ZeroShare!",
    `Hello,\n\n${from} has invited you to join ZeroShare. Click the link below to accept the invitation:\n\n${inviteLink}\n\nBest,\Pablo`,
    `<p>Hello,</p><p>${from} has invited you to join ZeroShare. Click the link below to accept the invitation:</p><p><a href="${inviteLink}">${inviteLink}</a></p><p>Best,<br>Pablo</p>`
  );
};

export async function sendFeedbackRequest(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const { email, message } = req.body;
    if (!email || !message)
      return res.status(400).json({ error: "Email and message are required" });
    const privateKeyPath = path.join(__dirname, "../../../private.asc");
    const privateKeyArmored = fs.readFileSync(privateKeyPath, "utf8").trim();
    const privateKey = await openpgp.readPrivateKey({
      armoredKey: privateKeyArmored,
    });
    const decryptedEmail = await openpgp
      .decrypt({
        message: await openpgp.readMessage({ armoredMessage: email }),
        decryptionKeys: privateKey,
      })
      .then((res) => res.data);
    const decryptedMessage = await openpgp
      .decrypt({
        message: await openpgp.readMessage({ armoredMessage: message }),
        decryptionKeys: privateKey,
      })
      .then((res) => res.data);
    await sendMail(
      "hello@zeroshare.io",
      `Feedback from ${decryptedEmail}`,
      decryptedMessage,
      `<p>Feedback from ${decryptedEmail}:</p><p>${decryptedMessage}</p>`
    );
    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
