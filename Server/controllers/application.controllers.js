import { Application } from "../models/application.models.js";
import { Job } from "../models/job.models.js";


// for role === "student"

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        // Only students can apply for jobs
        if (req.role === "recruiter") {
            return res.status(403).json({
                message: "Recruiters are not allowed to apply for jobs",
                success: false,
            });
        }

        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required",
                success: false,
            })
        }

        // check if user has already applied for the job 
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false,
            })
        }

        // check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not exists",
                success: false,
            })
        }

        // create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        })

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Application created successfully",
            success: true,
        })


    } catch (error) {
        console.error("applyJob error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}


// for role === "student"

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const application = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "job",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "company",
                    options: { sort: { createdAt: -1 } },
                }
            });

        if (!application) {
            return res.status(404).json({
                message: "No jobs applied",
                success: false,
            })
        }

        return res.status(200).json({
            application,
            success: true,
        })

    } catch (error) {
        console.error("getAppliedJobs error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}



// role === "recruiter"

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findById(jobId).populate({
            path: "applications",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "applicant",
            }
        })
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            })
        }

        // Only the recruiter who created this job can view its applicants
        if (job.created_by.toString() !== req.id) {
            return res.status(403).json({
                message: "You are not authorized to view applicants for this job",
                success: false,
            });
        }

        return res.status(200).json({
            job,
            success: true,
        })

    } catch (error) {
        console.error("getApplicants Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// role === "recruiter"

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(404).json({
                message: "Status is required",
                success: false,
            })
        }

        const application = await Application.findByIdAndUpdate(applicationId, { status: status.toLowerCase() });
        return res.status(200).json({
            message: "Status updated successfully",

            success: true,
        })

    } catch (error) {
        console.error("updateStatus error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}




