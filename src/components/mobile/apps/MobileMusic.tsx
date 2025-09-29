'use client';

export function MobileMusic() {
  // Default playlist - same as desktop
  const playlistId = '3qH7s11IkCeRRQM3cSK7hR'; // T'was September of 2025

  return (
    <div className="h-full bg-white">
      {/* Spotify Embed - Full Mobile Experience */}
      <iframe
        style={{ borderRadius: '0px' }}
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}