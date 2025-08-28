import mongoose from "mongoose";

export default function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("Mongo URI not available");
    process.exit(1);
  }
  mongoose.set("strictQuery", false);

  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Mongodb Connection Done");
    })
    .catch((err) => {
      console.log("Mongo Connection Error:");
      process.exit(1);
    });
}