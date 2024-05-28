import { PrismaClient } from "@prisma/client";

const db = new PrismaClient(); // 데이터베이스 생성 및 초기화

export default db;
