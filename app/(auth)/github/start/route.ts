import { redirect } from "next/navigation";

export async function GET() {
    const formattedParams = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        scope: "read:user,user:email", // github에 우리가 사용자로부터 원하는 데이터가 무엇인지 알려주는 것. https://docs.github.com/ko/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
        allow_signup: "true", // github 계정이 없다면 새로 만들어서 인가를 받을 것인지
        redirect_uri: process.env.GITHUB_REDIRECT_URI!,
    }).toString(); // 파라미터를 쿼리스트링으로 포맷팅

    const finalUrl = `https://github.com/login/oauth/authorize?${formattedParams}`;

    return redirect(finalUrl);
}
