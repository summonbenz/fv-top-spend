import { PUBLIC_API_URL } from '$env/static/public';

/**
 * Proxy GET /api/dashboard -> PUBLIC_API_URL
 * Forwards query string and returns upstream response, adding CORS header.
 */
export async function GET({ url, fetch, request }) {
  const qs = url.search || '';
  const target = PUBLIC_API_URL + qs;

  // Forward the request to the external API from the server (no CORS issues)
  const upstream = await fetch(target, {
    method: 'GET',
    headers: {
      // forward Accept and other useful headers
      accept: request.headers.get('accept') || '*/*'
    }
  });

  const body = await upstream.arrayBuffer();
  const headers = new Headers(upstream.headers);


  // Ensure the browser can call this endpoint
  headers.set('access-control-allow-origin', '*');
  headers.set('access-control-allow-methods', 'GET, POST, OPTIONS');

  // Remove hop-by-hop and encoding headers that can cause browser decode issues
  headers.delete('transfer-encoding');
  headers.delete('content-encoding');
  headers.delete('content-length');

  return new Response(body, {
    status: upstream.status,
    headers
  });
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'content-type'
    }
  });
}

export async function POST({ request, fetch }) {
  // Forward POST body and Content-Type header to the upstream API
  const contentType = request.headers.get('content-type') || 'application/json';
  const body = await request.text();

  const upstream = await fetch(PUBLIC_API_URL, {
    method: 'POST',
    headers: {
      'content-type': contentType
    },
    body
  });

  const respBody = await upstream.arrayBuffer();
  const headers = new Headers(upstream.headers);

  headers.set('access-control-allow-origin', '*');
  headers.set('access-control-allow-methods', 'GET, POST, OPTIONS');

  headers.delete('transfer-encoding');
  headers.delete('content-encoding');
  headers.delete('content-length');

  return new Response(respBody, {
    status: upstream.status,
    headers
  });
}
