import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
    id?: number;
}

export default async function getSession() {
    return await getIronSession<SessionContent>(cookies(), {
        cookieName: "delicious-karrot", // 해당 이름의 쿠키가 있는지 확인 / 없으면 생성
        password: process.env.COOKIE_PASSWORD!, // 비밀번호를 사용해 암호화
    });
}
