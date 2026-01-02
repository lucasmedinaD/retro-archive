import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

interface CharacterRequest {
    id: string;
    character_name: string;
    series?: string;
    votes: number;
    aliases: string[];
    created_at?: string;
}

// GET - Get rankings
export async function GET() {
    try {
        const supabase = getSupabaseAdmin();

        const { data, error } = await supabase
            .from('character_requests')
            .select('*')
            .order('votes', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Supabase error:', error);
            // Return fallback data from JSON
            return NextResponse.json({
                requests: [
                    { id: 'makima', characterName: 'Makima', series: 'Chainsaw Man', votes: 0 },
                    { id: 'gojo-satoru', characterName: 'Gojo Satoru', series: 'Jujutsu Kaisen', votes: 0 },
                    { id: 'yor-forger', characterName: 'Yor Forger', series: 'Spy x Family', votes: 0 }
                ]
            });
        }

        // Map to frontend format
        const requests = (data || []).map(d => ({
            id: d.id,
            characterName: d.character_name,
            series: d.series,
            votes: d.votes
        }));

        return NextResponse.json({ requests });
    } catch (error: any) {
        console.error('GET error:', error);
        return NextResponse.json({ requests: [] });
    }
}

// POST - Submit vote
export async function POST(request: NextRequest) {
    try {
        const supabase = getSupabaseAdmin();

        const body = await request.json();
        const { characterName, series } = body;

        if (!characterName || characterName.trim().length < 2) {
            return NextResponse.json({ error: 'Character name required' }, { status: 400 });
        }

        const normalizedName = characterName.trim();
        const id = normalizedName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Check if character exists
        const { data: existing } = await supabase
            .from('character_requests')
            .select('*')
            .or(`id.eq.${id},character_name.ilike.${normalizedName}`)
            .limit(1)
            .single();

        if (existing) {
            // Increment vote
            const { error } = await supabase
                .from('character_requests')
                .update({ votes: existing.votes + 1 })
                .eq('id', existing.id);

            if (error) {
                console.error('Update error:', error);
                return NextResponse.json({ error: 'Failed to update vote' }, { status: 500 });
            }
        } else {
            // Create new entry
            const { error } = await supabase
                .from('character_requests')
                .insert({
                    id,
                    character_name: normalizedName,
                    series: series?.trim() || null,
                    votes: 1,
                    aliases: [normalizedName.toLowerCase()]
                });

            if (error) {
                console.error('Insert error:', error);
                return NextResponse.json({ error: 'Failed to create vote' }, { status: 500 });
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Vote registered'
        });
    } catch (error: any) {
        console.error('Vote error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
