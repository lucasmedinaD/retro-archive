import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Data file path for storing contact messages
const MESSAGES_FILE = path.join(process.cwd(), 'src/data/messages.json');

interface ContactMessage {
    id: string;
    timestamp: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    lang: string;
    status: 'unread' | 'read' | 'replied';
}

async function getMessages(): Promise<ContactMessage[]> {
    try {
        const data = await fs.readFile(MESSAGES_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        return parsed.messages || [];
    } catch {
        return [];
    }
}

async function saveMessages(messages: ContactMessage[]): Promise<void> {
    await fs.writeFile(MESSAGES_FILE, JSON.stringify({ messages }, null, 2));
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;
        const lang = formData.get('lang') as string || 'en';

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Create contact message
        const contactMessage: ContactMessage = {
            id: `msg-${Date.now()}`,
            timestamp: new Date().toISOString(),
            name,
            email,
            subject: subject || 'No subject',
            message,
            lang,
            status: 'unread'
        };

        // Save to local storage
        const messages = await getMessages();
        messages.push(contactMessage);
        await saveMessages(messages);

        // TODO: Hook for email integration (Brevo/SendGrid)
        // await sendNotificationEmail(contactMessage);

        // Log for now
        console.log('📧 New contact message:', contactMessage.id, contactMessage.email);

        // Redirect back with success
        const redirectUrl = new URL(`/${lang}/contact`, request.url);
        redirectUrl.searchParams.set('success', 'true');

        return NextResponse.redirect(redirectUrl, { status: 303 });

    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        );
    }
}

// GET endpoint to check messages (for admin)
export async function GET() {
    try {
        const messages = await getMessages();
        return NextResponse.json({ success: true, messages });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}
