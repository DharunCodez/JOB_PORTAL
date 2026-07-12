import mongoose from "mongoose";
import dns from "dns";

// Node 18+ prefers IPv6 by default which breaks MongoDB SRV DNS resolution.
// Force IPv4 to match the MongoDB Atlas SRV record target.
dns.setDefaultResultOrder("ipv4first");

const connectDB = async (retryCount = 0) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 8000,
        });
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error(`MongoDB connection failed (attempt ${retryCount + 1}):`, error.message);
        console.error("➡  Fix: Go to cloud.mongodb.com → Network Access → ADD IP ADDRESS → Allow Access From Anywhere (0.0.0.0/0)");
        
        const delay = Math.min(5000 * (retryCount + 1), 30000); // up to 30s between retries
        console.log(`Retrying in ${delay / 1000}s...`);
        setTimeout(() => connectDB(retryCount + 1), delay);
    }
}


export default connectDB;
