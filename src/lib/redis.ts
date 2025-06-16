// lib/redis.ts
import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: process.env.REDIS_TOKEN,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
});

client.on('error', (err) => console.error('Redis Client Error:', err));

await client.connect();

export default client;
