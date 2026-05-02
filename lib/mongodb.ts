import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;

let client: MongoClient;
let isConnected = false;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(uri, {
      tls: true,
      tlsAllowInvalidCertificates: true, //cert error
    });
  }

  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }

  return client.db("d3-devesh");
}
