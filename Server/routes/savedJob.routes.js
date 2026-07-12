import express from "express";
import { toggleSaveJob, getSavedJobs } from "../controllers/savedJob.controllers.js";
import authUser from "../middlewares/authUser.js";

const savedJobRouter = express.Router();

savedJobRouter.post("/toggle/:jobId", authUser, toggleSaveJob);
savedJobRouter.get("/get", authUser, getSavedJobs);

export default savedJobRouter;
