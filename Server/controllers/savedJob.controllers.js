import { User } from "../models/user.model.js";

// Toggle save/unsave a job for a student
export const toggleSaveJob = async (req, res) => {
    try {
        const userId = req.id;
        const { jobId } = req.params;

        if (req.role !== "student") {
            return res.status(403).json({ message: "Only students can save jobs", success: false });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const alreadySaved = user.savedJobs.some(id => id.toString() === jobId);

        if (alreadySaved) {
            // Unsave it
            user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
            await user.save();
            return res.status(200).json({ message: "Job removed from saved list", saved: false, success: true });
        } else {
            // Save it
            user.savedJobs.push(jobId);
            await user.save();
            return res.status(200).json({ message: "Job saved successfully", saved: true, success: true });
        }

    } catch (error) {
        console.error("toggleSaveJob Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Get all saved jobs for the logged-in student
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;

        if (req.role !== "student") {
            return res.status(403).json({ message: "Only students can view saved jobs", success: false });
        }

        const user = await User.findById(userId).populate({
            path: "savedJobs",
            populate: {
                path: "company",
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        return res.status(200).json({ savedJobs: user.savedJobs, success: true });

    } catch (error) {
        console.error("getSavedJobs Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
