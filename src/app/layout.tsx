import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fountain Labs",
  description: "Vintage 90s team dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize a queue for Spotify SDK ready callbacks
              window._spotifySDKReadyCallbacks = [];
              window.onSpotifyWebPlaybackSDKReady = function() {
                console.log('Spotify SDK is ready!');
                // Call all registered callbacks
                if (window._spotifySDKReadyCallbacks && window._spotifySDKReadyCallbacks.length > 0) {
                  window._spotifySDKReadyCallbacks.forEach(function(callback) {
                    try {
                      callback();
                    } catch (e) {
                      console.error('Error in Spotify SDK callback:', e);
                    }
                  });
                }
                // Mark SDK as ready
                window._spotifySDKReady = true;
              };
            `,
          }}
        />
        <script src="https://sdk.scdn.co/spotify-player.js" async></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
