import express from "express";
const router = express.Router();

import {
	createJob,
	deleteJob,
	getAllJobs,
	updateJob,
	showStats,
	getSingleJob,
} from "../controllers/jobsController.js";
import authenticateUser from "../middleware/auth.js";

router.route("/").post(createJob).get(authenticateUser, getAllJobs);
router.route("/stats").get(authenticateUser, showStats);
// :id needs to be last.
router
	.route("/:id")
	.delete(deleteJob)
	.patch(authenticateUser, updateJob)
	.get(getSingleJob);

export default router;
