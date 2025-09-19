import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import session from "express-session";
import passport from "./config/passport.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 🔹 Routes
import authRoutes from "./routes/auth.routes.js";
import documentRoutes from "./routes/document.routes.js";

dotenv.config();

// Enable garbage collection if available
if (global.gc) {
  console.log('Garbage collection enabled');
} else {
  console.log('Garbage collection not available. Start with --expose-gc flag for better memory management');
}

// Memory monitoring
function logMemoryUsage() {
  const used = process.memoryUsage();
  console.log('Memory usage:', {
    rss: Math.round(used.rss / 1024 / 1024) + ' MB',
    heapTotal: Math.round(used.heapTotal / 1024 / 1024) + ' MB',
    heapUsed: Math.round(used.heapUsed / 1024 / 1024) + ' MB',
    external: Math.round(used.external / 1024 / 1024) + ' MB'
  });
}

// Log memory usage every 30 seconds
setInterval(logMemoryUsage, 30000);

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 🔹 Normalize CLIENT_URL (remove trailing slash if present)
const clientURL = (process.env.CLIENT_URL || "http://localhost:3000").replace(/\/$/, "");

// 🔹 Middlewares
app.use(
  cors({
    origin: clientURL,
    credentials: true,
  })
);

app.use(express.json()); // for parsing JSON bodies
app.use(express.urlencoded({ extended: true })); // for form data

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie:{
      httpOnly:true,
      secure:false,
      sameSite:"lax"
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 🔹 Connect DB
connectDB();

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend running... Auth, File Upload & AI APIs ready!");
});

// 🔹 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌐 Allowed client: ${clientURL}`);
});
