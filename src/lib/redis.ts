import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!, {
    password: process.env.REDIS_TOKEN,
    tls: { rejectUnauthorized: false },
});

export default redis;

