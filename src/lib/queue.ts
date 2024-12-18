import { Queue } from "bullmq";
import IORedis from "ioredis";

// Connect to Redis
const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");

// Create a queue for sending emails
export const queue = new Queue("emailQueue", { connection });
