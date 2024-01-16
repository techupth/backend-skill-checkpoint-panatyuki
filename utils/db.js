// Todo: Setup database connection here
// Named Import ตัว MongoClient มาจาก "mongodb"
import { MongoClient } from "mongodb";

const connectionString = "mongodb://localhost:27017";

// ผมต้องไม่ใส่ useUnifiedTopology: true
// ถ้าใส่ไปแล้วมันเชื่อมต่อไม่ได้ครับ
export const client = new MongoClient(connectionString);

export const db = client.db("practice-mongo");
