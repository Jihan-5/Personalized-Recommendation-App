/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co', // Placeholder images
            },
            {
                protocol: 'https',
                hostname: 'i.seadn.io', // OpenSea images
            },
             {
                protocol: 'https',
                hostname: 'm.media-amazon.com', // Amazon images
            }
        ],
    },
};

module.exports = nextConfig;