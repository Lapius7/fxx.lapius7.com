import { NextRequest } from 'next/server';
import { SITE_NAME } from '@/lib/site';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const targetUrl = new URL('https://fxtwitter.com/owoembed');
    
    const host = request.headers.get('host') || 'fxtwitter.lapius7.com';
    
    // Copy all query params, but translate 'url' back to fxtwitter.com
    searchParams.forEach((value, key) => {
        let val = value;
        if (key === 'url' && val.includes(host)) {
            val = val.replace(host, 'fxtwitter.com');
            // We no longer strip flags/extensions here to preserve context for upstream (e.g. replies on /m or /jp)
        }
        targetUrl.searchParams.set(key, val);
    });

    try {
        const headers = new Headers();
        request.headers.forEach((value, key) => {
            const forbidden = ['host', 'connection', 'content-length', 'content-type'];
            if (!forbidden.includes(key.toLowerCase())) {
                headers.set(key, value);
            }
        });

        const response = await fetch(targetUrl.toString(), {
            headers
        });

        if (!response.ok) {
            return new Response(await response.text(), { status: response.status });
        }

        let json = await response.json();
        
        let body = JSON.stringify(json);
        
        // ブランド名を全体的に置換 (author_name 内の統計情報等も含む)
        body = body.split('FxTwitter').join(SITE_NAME);

        return new Response(body, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'public, max-age=3600',
            }
        });
    } catch (error) {
        console.error('oEmbed Proxy error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
