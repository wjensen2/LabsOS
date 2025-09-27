// Cloudflare Function for Spotify OAuth callback
// @ts-ignore
export async function onRequest(context: any): Promise<Response> {
  const { request, env } = context;

  const url = new URL(request.url);
  const { searchParams } = url;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  const SPOTIFY_CLIENT_ID = env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET;

  // Check if this is a development request
  const devOriginMatch = state?.match(/dev_origin=([^&]+)/);
  const devOrigin = devOriginMatch ? decodeURIComponent(devOriginMatch[1]) : null;

  // Use dev origin if available, otherwise use current request origin
  const REDIRECT_URI = devOrigin || `${url.protocol}//${url.host}`;

  if (error) {
    console.error('Spotify OAuth error:', error);
    return Response.redirect(`${REDIRECT_URI}/#error=${error}`);
  }

  if (!code) {
    console.error('No authorization code received');
    return Response.redirect(`${REDIRECT_URI}/#error=no_code`);
  }

  try {
    // Exchange authorization code for access token
    // Always use production URL for token exchange (this must match the OAuth redirect_uri)
    const PRODUCTION_URI = env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'https://fountainsummit.com';
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${PRODUCTION_URI}/api/auth/spotify/callback`
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange failed:', errorData);
      return Response.redirect(`${REDIRECT_URI}/#error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, expires_in, refresh_token } = tokenData;

    // Calculate expiry time
    const expiryTime = Date.now() + (expires_in * 1000);

    // Redirect back to the main page with token in fragment
    const redirectUrl = `${REDIRECT_URI}/#access_token=${access_token}&expires_in=${expires_in}&token_type=Bearer&refresh_token=${refresh_token || ''}&expires_at=${expiryTime}`;

    return Response.redirect(redirectUrl);

  } catch (error) {
    console.error('OAuth callback error:', error);
    return Response.redirect(`${REDIRECT_URI}/#error=server_error`);
  }
}