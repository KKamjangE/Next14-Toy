import db from "@/lib/db";
import {
    getGithubAcessToken,
    getGithubEmail,
    getGithubProfile,
} from "@/lib/github-auth";
import { setSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code"); // code는 10분 이후 만료
    if (!code) {
        return new Response(null, { status: 400 });
    }

    const { access_token, error } = await getGithubAcessToken(code);

    if (error) {
        return new Response(null, { status: 400 });
    }

    const { avatar_url, id, login } = await getGithubProfile(access_token);

    const email = await getGithubEmail(access_token);

    const user = await db.user.findUnique({
        where: {
            github_id: id + "",
        },
        select: { id: true },
    });

    if (user) {
        // 이미 가입 + 등록된 계정
        await setSession(user.id);
        return redirect("/profile");
    }

    const existUserEmail = await db.user.findUnique({
        where: { email: email },
        select: { id: true },
    });

    if (Boolean(existUserEmail)) {
        // 이미 가입된 메일
        const newUser = await db.user.update({
            where: {
                email: email,
            },
            data: {
                github_id: id + "",
                avatar: avatar_url,
            },
            select: { id: true },
        });
        await setSession(newUser.id);
    } else {
        // 새로운 계정
        const newUser = await db.user.create({
            data: {
                username: login,
                github_id: id + "",
                avatar: avatar_url,
            },
            select: { id: true },
        });
        await setSession(newUser.id);
    }

    return redirect("/profile");
}
