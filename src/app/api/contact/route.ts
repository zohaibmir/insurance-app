import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Update with the path to your Prisma instance
import { queue } from "@/lib/queue"; // A queue setup (we'll define it later)

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        // Validate the input
        if (!name || !email || !message) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Save the contact information in the database
        const contact = await prisma.contactUs.create({
            data: {
                name,
                email,
                message,
                status: "pending", // Default status
            },
        });

        // Add the email-sending job to the queue
        await queue.add("sendEmail", {
            contactId: contact.contact_id,
            name: contact.name,
            email: contact.email,
            message: contact.message,
        });

        return NextResponse.json({ message: "Your message has been received!" }, { status: 201 });
    } catch (error) {
        console.error("Error saving contact message:", error);
        return NextResponse.json({ error: "Failed to save contact message" }, { status: 500 });
    }
}
