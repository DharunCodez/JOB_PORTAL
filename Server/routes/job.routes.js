import express from 'express';
import { getAllJobs, getJobById, getRecruiterJobs, postJob, deleteJob } from '../controllers/job.controllers.js';
import authUser from '../middlewares/authUser.js';

const jobRouter = express.Router()


jobRouter.post("/post", authUser, postJob);
jobRouter.get("/get", getAllJobs);
jobRouter.get("/get-recruiter-job", authUser, getRecruiterJobs);
jobRouter.get("/get/:id", getJobById);
jobRouter.delete("/delete/:id", authUser, deleteJob);



export default jobRouter;