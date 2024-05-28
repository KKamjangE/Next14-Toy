"use server";

import {
    PASSWORD_MIN_LENGTH,
    PASSWORD_REGEX,
    PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";

const checkPassword = ({
    password,
    confirm_password,
}: {
    password: string;
    confirm_password: string;
}) => password === confirm_password;

const checkUniqueUsername = async (username: string) => {
    const user = await db.user.findUnique({
        where: {
            username,
        },
        select: { id: true },
    });

    return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });

    return !Boolean(user);
};

const formSchema = z
    .object({
        username: z
            .string({
                invalid_type_error: "이름은 문자만 입력 가능합니다.",
                required_error: "이름을 필수 입니다.",
            })
            .toLowerCase()
            .trim()
            .refine(checkUniqueUsername, "This username is already taken."),
        email: z
            .string({ invalid_type_error: "이메일은 문자만 입력 가능합니다." })
            .email({ message: "이메일 형식에 맞지 않습니다." })
            .toLowerCase()
            .refine(
                checkUniqueEmail,
                "There is an account already registered with that email.",
            ),
        password: z
            .string({
                required_error: "비밀번호는 필수 입니다.",
                invalid_type_error: "비밀번호는 문자만 입력 가능합니다.",
            })
            .min(PASSWORD_MIN_LENGTH, "너무 짧습니다.")
            .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
        confirm_password: z
            .string({
                required_error: "비밀번호는 필수 입니다.",
                invalid_type_error: "비밀번호는 문자만 입력 가능합니다.",
            })
            .min(PASSWORD_MIN_LENGTH, "너무 짧습니다."),
    })
    .refine(checkPassword, {
        // object 전체에서 에러를 가져온다.
        message: "Both passwords should be the same!",
        path: ["confirm_password"], // 에러의 주최자가 누구인지 알려준다.
    });

export async function createAccount(prevState: any, formData: FormData) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password"),
    };

    const result = await formSchema.safeParseAsync(data); // safeParse를 사용하면 error를 throw하지 않는다.
    if (!result.success) {
        return result.error.flatten();
    } else {
        // check if the email is already used
        // hash password
        // save the user to db
        // log the user in
        // redirect "/home"
    }
}
