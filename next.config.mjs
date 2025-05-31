import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["images.unsplash.com", "unsplash.com", "pub-5482c8c79e08450d875d1ba6b0afe368.r2.dev"],
    },
};
  

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

export default nextConfig;
  