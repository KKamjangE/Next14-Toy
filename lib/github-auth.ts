export async function getGithubAcessToken(code: string) {
    const accessTokenParams = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
    }).toString();

    const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;

    const { error, access_token } = await (
        await fetch(accessTokenURL, {
            method: "POST",
            headers: { Accept: "application/json" },
        })
    ).json();

    return { error, access_token };
}

export async function getGithubProfile(access_token: string) {
    const { id, avatar_url, login } = await (
        await fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            cache: "no-cache", // 요청에 대한 캐시 X
        })
    ).json();

    return { id, avatar_url, login };
}

interface GithubEmails {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: "public" | "private" | null;
}

export async function getGithubEmail(access_token: string) {
    const emails: GithubEmails[] = await (
        await fetch("https://api.github.com/user/emails", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            cache: "no-cache",
        })
    ).json();

    return emails.find((email) => email.primary)?.email;
}
