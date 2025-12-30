import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Data file path for storing briefs (simple local storage)
const BRIEFS_FILE = path.join(process.cwd(), 'src/data/briefs.json');

interface BriefSubmission {
    id: string;
    timestamp: string;
    name: string;
    email: string;
    projectType: string;
    budget: string;
    deadline: string;
    references: string;
    notes: string;
    lang: string;
    status: 'pending' | 'reviewed' | 'quoted' | 'accepted' | 'completed';
}

async function getBriefs(): Promise<BriefSubmission[]> {
    try {
        const data = await fs.readFile(BRIEFS_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        return parsed.briefs || [];
    } catch {
        return [];
    }
}

async function saveBriefs(briefs: BriefSubmission[]): Promise<void> {
    await fs.writeFile(BRIEFS_FILE, JSON.stringify({ briefs }, null, 2));
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const projectType = formData.get('projectType') as string;
        const budget = formData.get('budget') as string;
        const deadline = formData.get('deadline') as string;
        const references = formData.get('references') as string;
        const notes = formData.get('notes') as string;
        const lang = formData.get('lang') as string || 'en';

        // Validation
        if (!name || !email || !projectType || !notes) {
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

        // Create brief submission
        const brief: BriefSubmission = {
            id: `brief-${Date.now()}`,
            timestamp: new Date().toISOString(),
            name,
            email,
            projectType,
            budget: budget || 'not-specified',
            deadline: deadline || 'flexible',
            references: references || '',
            notes,
            lang,
            status: 'pending'
        };

        // Save to local storage
        const briefs = await getBriefs();
        briefs.push(brief);
        await saveBriefs(briefs);

        // TODO: Hook for email integration (Brevo/SendGrid)
        // await sendNotificationEmail(brief);
        // await sendConfirmationEmail(brief);

        // Log for now (replace with email later)
        console.log('📬 New brief submission:', brief.id, brief.email);

        // Redirect to success page or return JSON
        const successMessage = lang === 'es'
            ? '¡Solicitud enviada! Te respondo en 24-48 horas.'
            : 'Request sent! I\'ll get back to you within 24-48 hours.';

        // For form submission, redirect back with success
        const redirectUrl = new URL(`/${lang}/custom`, request.url);
        redirectUrl.searchParams.set('success', 'true');

        return NextResponse.redirect(redirectUrl, { status: 303 });

    } catch (error) {
        console.error('Brief submission error:', error);
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        );
    }
}

// GET endpoint to check briefs (for admin)
export async function GET() {
    try {
        const briefs = await getBriefs();
        return NextResponse.json({ success: true, briefs });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch briefs' },
            { status: 500 }
        );
    }
}
