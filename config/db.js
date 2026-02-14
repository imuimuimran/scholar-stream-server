import { MongoClient } from "mongodb";

const connectDB = async () => {
  const client = new MongoClient(process.env.MONGO_URI);

  await client.connect();

  console.log("MongoDB Connected ✅");

  return client.db("scholarStream");
};

export default connectDB;
