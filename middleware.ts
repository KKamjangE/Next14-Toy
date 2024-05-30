import getSession from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

// 미들웨어는 빠른 속도로 동작하기 위해 node.js 에서 동작하는게 아니라 경량 버전과 같은 Edge runtime에서 동작한다.
// 때문에 node.js에서 사용하는 기능들을 모두 사용할 수는 없다.
export async function middleware(request: NextRequest) {
    console.log("hello");
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
