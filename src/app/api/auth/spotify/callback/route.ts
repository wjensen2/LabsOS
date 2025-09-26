import { NextRequest, NextResponse } from 'next/server';

// Required for static export compatibility
export const dynamic = 'force-dynamic';

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  // Check if this is a development request
  const devOriginMatch = state?.match(/dev_origin=([^&]+)/);
  const devOrigin = devOriginMatch ? decodeURIComponent(devOriginMatch[1]) : null;

  // Use dev origin if available, otherwise use current request origin
  const REDIRECT_URI = devOrigin || `${new URL(request.url).protocol}//${new URL(request.url).host}`;

  if (error) {
    console.error('Spotify OAuth error:', error);
    return NextResponse.redirect(`${REDIRECT_URI}/#error=${error}`);
  }

  if (!code) {
    console.error('No authorization code received');
    return NextResponse.redirect(`${REDIRECT_URI}/#error=no_code`);
  }

  try {
    // Exchange authorization code for access token
    // Always use production URL for token exchange (this must match the OAuth redirect_uri)
    const PRODUCTION_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'https://fountainsummit.com';
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
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
      return NextResponse.redirect(`${REDIRECT_URI}/#error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, expires_in, refresh_token } = tokenData;

    // Calculate expiry time
    const expiryTime = Date.now() + (expires_in * 1000);

    // Redirect back to the main page with token in fragment
    const redirectUrl = `${REDIRECT_URI}/#access_token=${access_token}&expires_in=${expires_in}&token_type=Bearer&refresh_token=${refresh_token || ''}&expires_at=${expiryTime}`;

    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(`${REDIRECT_URI}/#error=server_error`);
  }
}