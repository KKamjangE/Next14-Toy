"use server";

import crypto from "crypto";
import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { setSession } from "@/lib/session";

const phoneSchema = z
    .string()
    .trim()
    .refine(
        (phone) => validator.isMobilePhone(phone, "ko-KR"),
        "Wrong phone foramt",
    );

async function tokenExists(token: number) {
    // 입력값이 토큰과 일치하는지 확인
    const exists = await db.sMSToken.findUnique({
        where: {
            token: token.toString(),
        },
        select: { id: true },
    });

    return Boolean(exists);
}

// coerce: 강제로 input의 반환값인 string을 다른 타입으로 변경한다.
const tokenSchema = z.coerce
    .number()
    .min(100000)
    .max(999999)
    .refine(tokenExists, "This token does not exist.");

interface actionState {
    token: boolean;
}

async function createToken() {
    const token = crypto.randomInt(100000, 999999).toString();
    const exists = await db.sMSToken.findUnique({
        where: {
            token,
        },
        select: { id: true },
    });
    if (exists) {
        return createToken();
    } else {
        return token;
    }
}

export async function smsLogin(prevState: actionState, formData: FormData) {
    const phone = formData.get("phone");
    const token = formData.get("token");
    if (!prevState.token) {
        // 전화번호 입력
        const result = phoneSchema.safeParse(phone);
        if (!result.success) {
            // 전화번호 형식이 틀리다면
            return { token: false, error: result.error.flatten() };
        } else {
            // 전화번호 형식이 맞는 유저의 SMSToken 삭제
            await db.sMSToken.deleteMany({
                where: {
                    user: {
                        phone: result.data,
                    },
                },
            });
            const token = await createToken();
            await db.sMSToken.create({
                data: {
                    token,
                    user: {
                        connectOrCreate: {
                            // 사용자를 연결하거나 없으면 생성한다.
                            where: {
                                phone: result.data,
                            },
                            create: {
                                username: crypto
                                    .randomBytes(10)
                                    .toString("hex"),
                                phone: result.data,
                            },
                        },
                    },
                },
            });
            return { token: true };
        }
    } else {
        // 인증 코드 입력
        const result = await tokenSchema.spa(token); // spa: safeParseAsync의 줄임말
        if (!result.success) {
            return { token: true, error: result.error.flatten() };
        } else {
            const token = await db.sMSToken.findUnique({
                where: {
                    token: result.data.toString(),
                },
                select: { id: true, userId: true },
            });

            await setSession(token!.userId); // 토큰과 일치하는 사용자 로그인

            // 사용이 끝난 토큰 삭제
            await db.sMSToken.delete({
                where: {
                    id: token!.id,
                },
            });

            redirect("/profile");
        }
    }
}
