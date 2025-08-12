import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();


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
  

export default withNextIntl(nextConfig);
  