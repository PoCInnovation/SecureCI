import dotenv from 'dotenv';
import env from 'env-var';

dotenv.config();

const serverPort: number = env.get("SERVER_PORT").required(true).asIntPositive();
const appId: string = env.get("APP_ID").required(true).asString();
const clientId: string = env.get("CLIENT_ID").required(true).asString();
const clientSecret: string = env.get("CLIENT_SECRET").required(true).asString();
const webhookSecret: string = env.get("WEBHOOK_SECRET").required(true).asString(); 
const privateKeyPath: string = env.get("PRIVATE_KEY_PATH").required(true).asString(); 

export { serverPort, appId, clientId, clientSecret, webhookSecret, privateKeyPath };