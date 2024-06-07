/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            // 외부 출처 이미지 최적화 허용
            {
                hostname: "avatars.githubusercontent.com",
            },
            {
                hostname: "imagedelivery.net",
                pathname: "/qWs23S0Dinq76C8FV_L81g/**",
            },
        ],
    },
};

export default nextConfig;
