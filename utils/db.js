// Todo: Setup database connection here

// Named Import ตัว MongoClient มาจาก "mongodb"
import { MongoClient } from "mongodb";

const connectionString = "mongodb://localhost:27017";

export const client = new MongoClient(connectionString);

export const db = client.db("practice-mongo");
