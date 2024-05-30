import getSession from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

interface Routes {
    [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
    "/": true,
    "/login": true,
    "/sms": true,
    "/create-account": true,
    "/github/start": true,
    "/github/complete": true,
};

// 미들웨어는 빠른 속도로 동작하기 위해 node.js 에서 동작하는게 아니라 경량 버전과 같은 Edge runtime에서 동작한다.
// 때문에 node.js에서 사용하는 기능들을 모두 사용할 수는 없다.
export async function middleware(request: NextRequest) {
    const session = await getSession();
    const exists = publicOnlyUrls[request.nextUrl.pathname];
    if (!session.id) {
        // 사용자 세션이 없다면(로그아웃)
        if (!exists) {
            // public 페이지에 접근한게 아니라면
            return NextResponse.redirect(new URL("/", request.url));
        }
    } else {
        // 사용자 세션이 존재한다면(로그인)
        if (exists) {
            // public 페이지에 접근한다면
            return NextResponse.redirect(new URL("/products", request.url));
        }
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // 미들웨어가 특정 URL에서만 실행되도록 설정
};
