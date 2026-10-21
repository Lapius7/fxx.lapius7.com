import { NextRequest } from 'next/server';
import { SITE_NAME } from './site';


// user省略パス(/status/:id)用のダミーユーザー名。fxtwitter.com側はidだけで
// ツイートを解決できるため、実在しない値で問題ない。
const DUMMY_USER = 'i';

export async function proxyFxTwitter(
    request: NextRequest,
    user: string,
    rawId: string,
    slug: string[] | undefined
) {
    const userAgent = request.headers.get('user-agent') || '';

    // Handle .mp4, .jpg etc. in the ID
    let id = rawId;
    let extensionFlag = '';
    const extMatch = rawId.match(/^(\d+)\.(mp4|jpg|jpeg|gif|png|webp|mov)$/i);
    if (extMatch) {
        id = extMatch[1];
        extensionFlag = extMatch[2].toLowerCase();
    }

    // Extract flags from slug
    const slugParts = slug || [];
    let flag = extensionFlag;
    let targetPath = `/${user}/status/${rawId}`;

    // Handle /photo/n pattern in slug
    if (slugParts.length >= 2 && slugParts[0].toLowerCase() === 'photo') {
        const photoIndex = slugParts[1];
        targetPath = `/${user}/status/${id}/photo/${photoIndex}`;
    } else if (slugParts.length > 0 && !extensionFlag) {
        flag = slugParts[0].toLowerCase();
    }

    // Simplified target assignment
    let targetHost = 'fxtwitter.com';
    const subdomainFlags = ['i', 'm', 'v', 'd', 'g', 't'];

    // Handle specific flags that require subdomain or path modification
    if (subdomainFlags.includes(flag) && !extensionFlag) {
        targetHost = `${flag}.fxtwitter.com`;
    } else if (flag && /^[a-z]{2}$/.test(flag)) {
        // Translation flags (ISO codes like en, jp)
        targetPath = `/${user}/status/${id}/${flag}`;
    } else if (flag && !extensionFlag && targetPath === `/${user}/status/${rawId}`) {
        // Fallback for other path-based flags (only if not an extension)
        targetPath = `/${user}/status/${id}/${flag}`;
    }

    const { search } = new URL(request.url);
    const targetUrl = `https://${targetHost}${targetPath}${search}`;

    try {
        const headers = new Headers();
        // Forward headers from the client
        request.headers.forEach((value, key) => {
            const forbidden = ['host', 'connection', 'content-length', 'content-type'];
            if (!forbidden.includes(key.toLowerCase())) {
                headers.set(key, value);
            }
        });
        if (userAgent) headers.set('User-Agent', userAgent);

        // For media extensions, override Accept to get a direct file/redirect
        if (extensionFlag) {
            headers.set('Accept', '*/*');
        }
        const response = await fetch(targetUrl, {
            headers,
            redirect: 'manual',
        });

        const host = request.headers.get('host') || 'fxx.lapius7.com';

        // Handle redirects - Revert to simple direct proxying
        if (response.status >= 300 && response.status < 400) {
            const redirectHeaders = new Headers();
            let location = response.headers.get('location');
            // x.ohax.pw経由の場合、X本体へのリダイレクト先にutm_sourceを付与
            if (location && host.includes('ohax.pw') && /^https:\/\/(x|twitter)\.com\//.test(location)) {
                const locationUrl = new URL(location);
                locationUrl.searchParams.set('utm_source', 'ohatwikeeper.com');
                location = locationUrl.toString();
            }
            if (location) redirectHeaders.set('location', location);
            ['cache-control', 'vary', 'set-cookie'].forEach(h => {
                const val = response.headers.get(h);
                if (val) redirectHeaders.set(h, val);
            });
            return new Response(null, { status: response.status, headers: redirectHeaders });
        }

        // Response processing
        const contentType = response.headers.get('content-type') || '';

        // Prepare response headers
        const responseHeaders = new Headers();
        const headersToCopy = ['content-type', 'cache-control', 'location', 'vary', 'set-cookie'];
        headersToCopy.forEach(h => {
            const val = response.headers.get(h);
            if (val) responseHeaders.set(h, val);
        });

        // Binary Bypass: If it's not HTML, return as-is
        if (!contentType.includes('text/html')) {
            const buffer = await response.arrayBuffer();
            return new Response(buffer, {
                status: response.status,
                headers: responseHeaders
            });
        }

        // HTML Processing
        let body = await response.text();

        // 1. ブランド名を置換
        body = body.split('FxTwitter').join(SITE_NAME);

        // 2. oEmbedリンクのみ置換 (ブランディング用)
        body = body.split('fxtwitter.com/owoembed').join(`${host}/owoembed`);

        // 3. x.ohax.pw経由の場合のみ、X本体への自動遷移(meta refresh)にutm_sourceを付与
        if (host.includes('ohax.pw')) {
            body = body.replace(
                /(<meta http-equiv="refresh" content="0;url=)(https:\/\/(?:x|twitter)\.com\/[^"]*)(")/,
                (match, prefix, url, suffix) => {
                    const withUtm = url + (url.includes('?') ? '&' : '?') + 'utm_source=ohatwikeeper.com';
                    return prefix + withUtm + suffix;
                }
            );
        }

        return new Response(body, {
            status: response.status,
            headers: responseHeaders
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return new Response('Upstream error', { status: 500 });
    }
}

export { DUMMY_USER };
