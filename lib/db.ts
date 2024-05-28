import { PrismaClient } from "@prisma/client";

const db = new PrismaClient(); // 데이터베이스 생성 및 초기화

async function test() {
    const user = await db.user.create({
        data: {
            username: "test",
        },
    });

    console.log(user);
}

test();

export default db;
