import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["400", "500"],
    style: ["normal"],
    variable: "--roboto-text", // 변수로 만들어서 var(--roboto-text) 와 같이 사용 가능하다.
});

// 변수로 만든 값은 tailwind.config에서 커스텀 클래스로 만든다.

export const metadata: Metadata = {
    title: {
        template: "%s | Karrot Market",
        default: "Karrot Market",
    },
    description: "Sell and buy all the things",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            {/* class에 variable을 전달해줘야 적용된다. */}
            <body
                className={`${roboto.variable} mx-auto max-w-screen-sm bg-neutral-900 text-white`}
            >
                {children}
            </body>
        </html>
    );
}
