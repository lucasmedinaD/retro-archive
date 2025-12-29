'use server';

import fs from 'fs';
import path from 'path';

interface Subscriber {
    email: string;
    subscribedAt: string;
}

type FormState = {
    error?: string;
    success?: boolean;
};

export async function subscribeToNewsletter(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const email = formData.get('email') as string;

    // Validation
    if (!email || !email.includes('@')) {
        return { error: 'Email inválido' };
    }

    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'newsletter.json');

        // Read existing subscribers
        let subscribers: Subscriber[] = [];
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            subscribers = JSON.parse(fileContent);
        } catch (error) {
            // File doesn't exist yet, start with empty array
            subscribers = [];
        }

        // Check if already subscribed
        if (subscribers.some(sub => sub.email.toLowerCase() === email.toLowerCase())) {
            return { error: 'Ya estás suscrito' };
        }

        // Add new subscriber
        subscribers.push({
            email,
            subscribedAt: new Date().toISOString(),
        });

        // Write back to file
        fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2));

        return { success: true };
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return { error: 'Error al suscribirse. Intenta de nuevo.' };
    }
}
