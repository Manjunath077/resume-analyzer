import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

class MongoDBClient {
  private client?: MongoClient;
  private clientPromise: Promise<MongoClient>;

  constructor() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is not defined");
    }

    if (process.env.NODE_ENV === "production") {
      this.client = new MongoClient(uri);
      this.clientPromise = this.client.connect();
    } else {
      if (!global._mongoClientPromise) {
        this.client = new MongoClient(uri);
        global._mongoClientPromise = this.client.connect();
      }
      this.clientPromise = global._mongoClientPromise;
    }
  }

  getClientPromise(): Promise<MongoClient> {
    return this.clientPromise;
  }

  async getDb() {
    const client = await this.clientPromise;
    return client.db();
  }

  async getCollection(collectionName: string) {
    const db = await this.getDb();
    return db.collection(collectionName);
  }
}

export const mongoClient = new MongoDBClient();

export default mongoClient.getClientPromise();