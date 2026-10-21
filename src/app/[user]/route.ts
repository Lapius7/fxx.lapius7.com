import { NextRequest } from 'next/server';
import { proxyFxTwitter, DUMMY_USER } from '@/lib/fxtwitter-proxy';

// x.ohax.pw/:id (statusもuserも省略した最短形式)用。
// [user]セグメントが数字のみ(+対応拡張子)の場合だけツイートIDとして扱う。
// それ以外(実際のユーザー名など)は404にする(プロフィールページ自体は非対応のため)。
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ user: string }> }
) {
    const { user } = await params;
    if (!/^\d+(\.(mp4|jpg|jpeg|gif|png|webp|mov))?$/i.test(user)) {
        return new Response('Not Found', { status: 404 });
    }
    return proxyFxTwitter(request, DUMMY_USER, user, undefined);
}
