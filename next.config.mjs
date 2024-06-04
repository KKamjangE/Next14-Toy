/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            // 외부 출처 이미지 최적화 허용
            {
                hostname: "avatars.githubusercontent.com",
            },
        ],
    },
};

export default nextConfig;
