import { createClient } from "redis";
import config from "../config/config";

const redisHostUrl = config.redis_host;

const redisClient = createClient({
    url: config.node_env === 'production' ? redisHostUrl : `redis://redis:6379`,
});
redisClient.on('error', (err) => {
    console.error('Redis client error', err);
});
(async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Redis connection error:", error);
    }
})();
export default redisClient;