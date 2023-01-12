import express from "express";
const router = express.Router();

import {
	createJob,
	deleteJob,
	getAllJobs,
	updateJob,
	showStats,
} from "../controllers/jobsController.js";
import authenticateUser from "../middleware/auth.js";

router.route("/").post(createJob).get(authenticateUser, getAllJobs);
router.route("/stats").get(authenticateUser, showStats);
// :id needs to be last.
router.route("/:id").delete(deleteJob).patch(authenticateUser, updateJob);

export default router;
