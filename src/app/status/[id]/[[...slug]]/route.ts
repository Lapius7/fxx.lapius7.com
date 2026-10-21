import { NextRequest } from 'next/server';
import { proxyFxTwitter, DUMMY_USER } from '@/lib/fxtwitter-proxy';

// ユーザー名を省略した /status/:id 形式のアクセス用(x.ohax.pw経由)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; slug?: string[] }> }
) {
    const { id, slug } = await params;
    return proxyFxTwitter(request, DUMMY_USER, id, slug);
}
