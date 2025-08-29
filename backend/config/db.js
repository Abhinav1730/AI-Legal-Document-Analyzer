import mongoose from "mongoose";

export default async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("Mongo URI not available");
    process.exit(1);
  }
  

try {
    mongoose.set("strictQuery", false);
    await mongoose
      .connect(uri)
      console.log("Mongodb Connection Done");
        
       
} catch (error) {
  console.log("Mongo Connection Error:");
   process.exit(1);
}
}