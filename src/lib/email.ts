/**
 * Email Utility
 * Prepared hooks for Brevo/SendGrid integration
 * 
 * To enable email sending:
 * 1. Install: npm install @sendinblue/client or @sendgrid/mail
 * 2. Add API key to .env.local: BREVO_API_KEY or SENDGRID_API_KEY
 * 3. Uncomment the relevant implementation below
 */

export interface EmailPayload {
    to: string;
    subject: string;
    htmlContent: string;
    textContent?: string;
    replyTo?: string;
}

export interface NotificationPayload {
    type: 'brief' | 'contact' | 'newsletter';
    data: Record<string, any>;
}

// ===============================
// MAIN EMAIL FUNCTIONS (HOOKS)
// ===============================

/**
 * Send notification email (to admin when form is submitted)
 * Currently logs to console - replace with actual email service
 */
export async function sendNotificationEmail(payload: NotificationPayload): Promise<boolean> {
    if (process.env.NODE_ENV === 'development') {
        console.log('📧 [EMAIL HOOK] Notification:', payload.type, payload.data);
    }

    // TODO: Uncomment and configure when Brevo/SendGrid is set up
    // return await sendWithBrevo({
    //     to: 'hello@retro-archive.art',
    //     subject: getNotificationSubject(payload.type),
    //     htmlContent: buildNotificationHtml(payload),
    // });

    return true; // Simulated success
}

/**
 * Send confirmation email (to user after form submission)
 * Currently logs to console - replace with actual email service
 */
export async function sendConfirmationEmail(to: string, type: 'brief' | 'contact' | 'newsletter', lang: 'en' | 'es' = 'en'): Promise<boolean> {
    if (process.env.NODE_ENV === 'development') {
        console.log('📧 [EMAIL HOOK] Confirmation to:', to, 'type:', type, 'lang:', lang);
    }

    // TODO: Uncomment and configure when Brevo/SendGrid is set up
    // return await sendWithBrevo({
    //     to,
    //     subject: getConfirmationSubject(type, lang),
    //     htmlContent: buildConfirmationHtml(type, lang),
    // });

    return true; // Simulated success
}

/**
 * Send welcome email with freebie download links
 */
export async function sendWelcomeEmail(to: string, lang: 'en' | 'es' = 'en'): Promise<boolean> {
    if (process.env.NODE_ENV === 'development') {
        console.log('📧 [EMAIL HOOK] Welcome email to:', to, 'lang:', lang);
    }

    // TODO: Uncomment and configure when Brevo/SendGrid is set up
    // return await sendWithBrevo({
    //     to,
    //     subject: lang === 'es' ? '¡Bienvenido a Retro Archive!' : 'Welcome to Retro Archive!',
    //     htmlContent: buildWelcomeHtml(lang),
    // });

    return true; // Simulated success
}

// ===============================
// EMAIL TEMPLATES
// ===============================

function getNotificationSubject(type: 'brief' | 'contact' | 'newsletter'): string {
    switch (type) {
        case 'brief': return '🎨 New Custom Design Request';
        case 'contact': return '📧 New Contact Form Message';
        case 'newsletter': return '📬 New Newsletter Signup';
        default: return 'New Form Submission';
    }
}

function getConfirmationSubject(type: 'brief' | 'contact' | 'newsletter', lang: 'en' | 'es'): string {
    if (lang === 'es') {
        switch (type) {
            case 'brief': return '✅ Recibimos tu solicitud - Retro Archive';
            case 'contact': return '✅ Mensaje recibido - Retro Archive';
            case 'newsletter': return '🎁 ¡Bienvenido a Retro Archive!';
            default: return 'Confirmación - Retro Archive';
        }
    }
    switch (type) {
        case 'brief': return '✅ Request Received - Retro Archive';
        case 'contact': return '✅ Message Received - Retro Archive';
        case 'newsletter': return '🎁 Welcome to Retro Archive!';
        default: return 'Confirmation - Retro Archive';
    }
}

function buildNotificationHtml(payload: NotificationPayload): string {
    const { type, data } = payload;
    return `
        <h1>New ${type} submission</h1>
        <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
}

function buildConfirmationHtml(type: 'brief' | 'contact' | 'newsletter', lang: 'en' | 'es'): string {
    if (lang === 'es') {
        return `
            <h1>¡Gracias por contactarnos!</h1>
            <p>Recibimos tu ${type === 'brief' ? 'solicitud de diseño' : 'mensaje'}.</p>
            <p>Te responderemos en 24-48 horas.</p>
            <p>– Retro Archive</p>
        `;
    }
    return `
        <h1>Thanks for reaching out!</h1>
        <p>We received your ${type === 'brief' ? 'design request' : 'message'}.</p>
        <p>We'll get back to you within 24-48 hours.</p>
        <p>– Retro Archive</p>
    `;
}

function buildWelcomeHtml(lang: 'en' | 'es'): string {
    if (lang === 'es') {
        return `
            <h1>¡Bienvenido a Retro Archive!</h1>
            <p>Gracias por unirte a nuestra comunidad.</p>
            <h2>Tus descargas gratis:</h2>
            <ul>
                <li><a href="https://retro-archive.art/downloads/wallpapers.zip">Pack de Wallpapers</a></li>
                <li><a href="https://retro-archive.art/downloads/stickers.zip">Pack de Stickers</a></li>
            </ul>
            <p>– Retro Archive</p>
        `;
    }
    return `
        <h1>Welcome to Retro Archive!</h1>
        <p>Thanks for joining our community.</p>
        <h2>Your free downloads:</h2>
        <ul>
            <li><a href="https://retro-archive.art/downloads/wallpapers.zip">Wallpaper Pack</a></li>
            <li><a href="https://retro-archive.art/downloads/stickers.zip">Sticker Pack</a></li>
        </ul>
        <p>– Retro Archive</p>
    `;
}

// ===============================
// BREVO IMPLEMENTATION (COMMENTED)
// ===============================

/*
import * as SibApiV3Sdk from '@sendinblue/client';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

async function sendWithBrevo(payload: EmailPayload): Promise<boolean> {
    try {
        const sendSmtpEmail = {
            to: [{ email: payload.to }],
            sender: { email: 'hello@retro-archive.art', name: 'Retro Archive' },
            subject: payload.subject,
            htmlContent: payload.htmlContent,
            replyTo: payload.replyTo ? { email: payload.replyTo } : undefined,
        };

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        return true;
    } catch (error) {
        console.error('Brevo email error:', error);
        return false;
    }
}
*/

// ===============================
// SENDGRID IMPLEMENTATION (COMMENTED)
// ===============================

/*
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

async function sendWithSendGrid(payload: EmailPayload): Promise<boolean> {
    try {
        await sgMail.send({
            to: payload.to,
            from: 'hello@retro-archive.art',
            subject: payload.subject,
            html: payload.htmlContent,
            text: payload.textContent,
            replyTo: payload.replyTo,
        });
        return true;
    } catch (error) {
        console.error('SendGrid email error:', error);
        return false;
    }
}
*/
