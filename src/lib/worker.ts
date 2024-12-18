import { Worker } from "bullmq";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your email provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or an app password
  },
});

// Define the worker
const worker = new Worker(
  "emailQueue",
  async (job) => {
    const { contactId, name, email, message } = job.data;

    // Fetch the contact information from the database (optional)
    const contact = await prisma.contactUs.findUnique({
      where: { contact_id: contactId },
    });

    if (!contact) {
      throw new Error(`Contact with ID ${contactId} not found`);
    }

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email, // Send to the user
      subject: "Thank you for contacting us",
      text: `Hi ${name},\n\nThank you for your message:\n\n${message}\n\nWe will get back to you shortly.\n\nBest regards,\nYour Team`,
    });

    // Update the contact status to "processed"
    await prisma.contactUs.update({
      where: { contact_id: contactId },
      data: { status: "processed" },
    });

    console.log(`Email sent successfully to ${email}`);
  },
  { connection }
);

// Log worker errors
worker.on("failed", (job, error) => {
  if (!job) {
    console.error("Job failed, but the job object is undefined:", error);
    return;
  }

  console.error(`Job failed for ${job.id}:`, error);
});
