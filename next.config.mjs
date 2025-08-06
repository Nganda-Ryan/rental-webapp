import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["images.unsplash.com", "unsplash.com", "pub-5482c8c79e08450d875d1ba6b0afe368.r2.dev"],
    },
    experimental: {
      serverActions: {
        bodySizeLimit: '100mb', // or '1000MB', etc.
      },
    },
};


const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
  