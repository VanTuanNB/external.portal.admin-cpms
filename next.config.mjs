import path from 'path';
const __dirname = path.resolve();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    logging: {
        fetches: {
            fullUrl: process.env.NODE_ENV === 'development',
        },
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'global')],
    },
    env: {
        NEXT_PUBLIC_API_ENDPOINT: process.env.API_ENDPOINT,
        NEXT_PUBLIC_STATIC_ENDPOINT: process.env.STATIC_ENDPOINT,
        NEXT_PUBLIC_PREFIX_API_ENDPOINT: process.env.PREFIX_ENDPOINT,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i0.wp.com',
            },
        ],
    },
    async headers() {
        return [
            {
                // matching all API routes
                // https://vercel.com/guides/how-to-enable-cors
                source: '/api/(.*)',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
