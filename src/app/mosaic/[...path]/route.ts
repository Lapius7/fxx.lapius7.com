import { NextRequest } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const targetPath = '/' + path.join('/');
    const targetUrl = `https://mosaic.fxtwitter.com${targetPath}`;

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': request.headers.get('user-agent') || '',
            }
        });

        if (!response.ok) {
            return new Response(await response.text(), { status: response.status });
        }

        const body = await response.arrayBuffer();
        const responseHeaders = new Headers();
        
        // Copy essential media headers
        ['content-type', 'cache-control', 'content-length'].forEach(h => {
            const val = response.headers.get(h);
            if (val) responseHeaders.set(h, val);
        });

        return new Response(body, {
            status: response.status,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('Mosaic Proxy error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
