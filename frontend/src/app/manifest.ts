import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Planora',
    short_name: 'Planora',
    description: 'Platform marketplace layanan event',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#FF9A9E',
    icons: [
      {
        src: '/images/logogmbr.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/logogmbr.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
