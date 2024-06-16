import nodemailer from 'nodemailer';
import {logger} from "../server";
import * as fs from "node:fs";
import * as HandleBars from "handlebars";

const FROM = "no-reply@harmony-itba.com"

export class MailService {
    public static async sendJoinOrgRequestMail(user: string, org: number) {
        const subject = "You've been invited to join an organization!";

        const emailTemplateSource = fs.readFileSync('/app/service/templates/emailTemplate.hbs', 'utf8');
        const template = HandleBars.compile(emailTemplateSource);

        const joinUrl = `http://localhost:5173/accept-invitation?user=${user}&org=${org}`;
        const html = template({
            message: "You've been invited to join an organization on Harmony!",
            clickme: "CLICK HERE TO JOIN",
            url: joinUrl
        });

        await this.sendMail(user, subject, html);
    }

    public static async sendNewMemberJoinedMail(user: string[], org: number) {
        const subject = "A new member has joined your organization!";

        const emailTemplateSource = fs.readFileSync('/app/service/templates/emailTemplate.hbs', 'utf8');
        const template = HandleBars.compile(emailTemplateSource);

        const viewUrl = `http://localhost:5173/orgs/${org}`;

        const html = template({
            message: "A new member has joined your organization on Harmony!",
            clickme: "CLICK HERE TO SEE WHO JOINED",
            url: viewUrl
        });

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