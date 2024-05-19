import nodemailer from 'nodemailer';
import {logger} from "../server";

const FROM = "no-reply@harmony-itba.com"

export class MailService {
    public static async sendJoinOrgRequestMail(user: string, org: number) {
        const subject = "You've been invited to join an organization!";
        const html = `<p>Hi there!</p>
        <p>You've been invited to join an organization on Harmony!</p>
        <p>Click <a href="http://localhost:5173/accept-invitation?user=${user}&org=${org}">here</a> to join the organization!</p>
        <p>Thanks for using Harmony!</p>`;

        await this.sendMail(user, subject, html);
    }

    public static async sendNewMemberJoinedMail(user: string[], org: number) {
        const subject = "A new member has joined your organization!";
        const html = `<p>Hi there!</p>
        <p>A new member has joined your organization on Harmony!</p>
        <p>Click <a href="http://localhost:5173/org/${org}">here</a> to see who joined!</p>
        <p>Thanks for using Harmony!</p>`;

        await this.sendMail(user, subject, html);
    }

    public static async sendMail(to: string | string[], subject: string, html: string) {
        const transporter = nodemailer.createTransport({
            service: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: FROM,
            to: to,
            subject: subject,
            html: html
        };

        logger.info(`Sending mail to - ${to}`);
        transporter.sendMail(mailOptions, (error, info)=> {
            if (error) {
                logger.error(error);
            } else {
                logger.info('Email sent: ' + info.response);
            }
        });
    }

}