"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";

const phoneSchema = z
    .string()
    .trim()
    .refine(
        (phone) => validator.isMobilePhone(phone, "ko-KR"),
        "Wrong phone foramt",
    );

// coerce: 강제로 input의 반환값인 string을 다른 타입으로 변경한다.
const tokenSchema = z.coerce.number().min(100000).max(999999);

interface actionState {
    token: boolean;
}

export async function smsLogin(prevState: actionState, formData: FormData) {
    const phone = formData.get("phone");
    const token = formData.get("token");
    if (!prevState.token) {
        const result = phoneSchema.safeParse(phone);
        if (!result.success) {
            // 전화번호 형식이 틀리다면
            return { token: false, error: result.error.flatten() };
        } else {
            // 전화번호 형식이 맞다면
            return { token: true };
        }
    } else {
        const result = tokenSchema.safeParse(token);
        if (!result.success) {
            return { token: true, error: result.error.flatten() };
        } else {
            redirect("/");
        }
    }
}
