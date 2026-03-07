// This file handles MongoDB connection for NextAuth

import { MongoClient } from 'mongodb';

// Check if MongoDB URI is defined
if (!process.env.MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

// Declare global mongoose variable (for hot reloading)
declare global {
    var _mongoClientPromise: Promise<MongoClient>;
}

class MongoDBClient {
    private client?: MongoClient;
    private clientPromise: Promise<MongoClient>;

    constructor() {
        // In production, create new connection
        if (process.env.NODE_ENV === 'production') {
            this.client = new MongoClient(uri, options);
            this.clientPromise = this.client.connect();
        }
        // In development, reuse connection to prevent multiple instances
        else {
            if (!global._mongoClientPromise) {
                this.client = new MongoClient(uri, options);
                global._mongoClientPromise = this.client.connect();
            }
            this.clientPromise = global._mongoClientPromise;
        }
    }

    // Get the MongoDB client promise (used by NextAuth)
    getClientPromise(): Promise<MongoClient> {
        return this.clientPromise;
    }

    // Helper to get database instance
    async getDb() {
        const client = await this.clientPromise;
        return client.db();
    }

    // Helper to get a specific collection
    async getCollection(collectionName: string) {
        const db = await this.getDb();
        return db.collection(collectionName);
    }
}

// Export singleton instance
export const mongoClient = new MongoDBClient();

// For NextAuth adapter
export default mongoClient.getClientPromise();