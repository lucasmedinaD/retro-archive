import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/character_requests.json');

interface CharacterRequest {
    id: string;
    characterName: string;
    series?: string;
    votes: number;
    aliases: string[];
}

interface RequestsData {
    requests: CharacterRequest[];
}

// GET - Get rankings
export async function GET() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        const parsed: RequestsData = JSON.parse(data);

        // Sort by votes descending
        const sorted = parsed.requests.sort((a, b) => b.votes - a.votes);

        return NextResponse.json({
            requests: sorted.slice(0, 20) // Top 20
        });
    } catch (error) {
        return NextResponse.json({ requests: [] });
    }
}

// POST - Submit vote
export async function POST(request: NextRequest) {
    try {
        // Rate limiting check via header (client sends localStorage flag)
        const ip = request.headers.get('x-forwarded-for') || 'unknown';

        const body = await request.json();
        const { characterName, series } = body;

        if (!characterName || characterName.trim().length < 2) {
            return NextResponse.json({ error: 'Character name required' }, { status: 400 });
        }

        const normalizedName = characterName.trim().toLowerCase();

        // Read current data
        let data: RequestsData;
        try {
            const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
            data = JSON.parse(fileContent);
        } catch {
            data = { requests: [] };
        }

        // Find existing character (fuzzy match on name or aliases)
        let existingIndex = data.requests.findIndex(r =>
            r.characterName.toLowerCase() === normalizedName ||
            r.aliases.some(a => a.toLowerCase() === normalizedName)
        );

        if (existingIndex !== -1) {
            // Increment vote
            data.requests[existingIndex].votes += 1;
        } else {
            // Create new entry
            const id = normalizedName.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            data.requests.push({
                id,
                characterName: characterName.trim(),
                series: series?.trim() || undefined,
                votes: 1,
                aliases: [normalizedName]
            });
        }

        // Save
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));

        return NextResponse.json({
            success: true,
            message: 'Vote registered'
        });
    } catch (error: any) {
        console.error('Vote error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
