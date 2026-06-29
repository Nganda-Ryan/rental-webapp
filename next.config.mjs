import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();


/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "images.unsplash.com",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "unsplash.com",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "pub-5482c8c79e08450d875d1ba6b0afe368.r2.dev",
          pathname: "/**",
        },
      ],
    },
    experimental: {
      serverActions: {
        bodySizeLimit: '100mb', // or '1000MB', etc.
      },
    },
};
  

export default withNextIntl(nextConfig);
  