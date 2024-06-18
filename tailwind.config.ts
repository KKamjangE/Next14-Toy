import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // 커스텀 클래스를 만든다.
                roboto: "var(--roboto-text)",
                rubik: "var(--rubik-text)",
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
export default config;
