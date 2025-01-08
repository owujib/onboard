import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 1025,
    secure: false,
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    await transporter.sendMail({
        from: "noreply@example.com",
        to,
        subject,
        text,
    });
};
