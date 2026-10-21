import { NextRequest } from 'next/server';
import { proxyFxTwitter } from '@/lib/fxtwitter-proxy';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ user: string; id: string; slug?: string[] }> }
) {
    const { user, id, slug } = await params;
    return proxyFxTwitter(request, user, id, slug);
}
