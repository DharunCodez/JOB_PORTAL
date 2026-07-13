import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./utils/db.js";
import userRouter from "./routes/user.routes.js";
import companyRouter from "./routes/company.routes.js";
import jobRouter from "./routes/job.routes.js";
import applicantionRouter from "./routes/application.routes.js";
import savedJobRouter from "./routes/savedJob.routes.js";

dotenv.config({});

const app = express();

// ── CORS must be registered BEFORE all routes ──────────────────────────
// ── CORS must be registered BEFORE all routes ──────────────────────────
const allowedOrigins = [
    "http://localhost:5173",
    "https://job-portal-puce-nine.vercel.app"
];

if (process.env.FRONTEND_URL) {
    // Add the URL exactly as it is in Render settings
    allowedOrigins.push(process.env.FRONTEND_URL);
    // Automatically add a version WITHOUT a trailing slash just in case
    allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""));
}

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
};
app.use(cors(corsOptions));

// ── Body / Cookie parsers ───────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── DB connection guard — returns 503 if Mongoose is not connected ──────
app.use("/api", (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: "Database not connected. Please try again in a moment.",
            success: false,
        });
    }
    next();
});

// ── Health check ────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.send("Welcome to the server");
});

// ── API Routes ──────────────────────────────────────────────────────────
app.use("/api/v1/user", userRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicantionRouter);
app.use("/api/v1/savedjob", savedJobRouter);

// ── Global error handler ────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ 
        message: "Internal server error", 
        error: err.message, 
        stack: err.stack, 
        success: false 
    });
});

const PORT = process.env.PORT || 3000;

// Connect DB then start listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
});
