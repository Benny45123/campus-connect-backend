const {createClient} = require('redis');

require('dotenv').config({path:'../.env'});
const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket:{
        host:process.env.REDIS_HOST,
        port:process.env.REDIS_PORT
    }
});
redisClient.on('error', (err) => console.error('Redis Client Error', err));
(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Redis Connection Error:', err);
    }
})();
module.exports = redisClient;