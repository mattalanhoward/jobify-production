import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
	{
		company: {
			type: String,
			required: [true, "Please provide company"],
			maxlength: 50,
		},
		position: {
			type: String,
			required: [true, "Please provide position"],
			maxlength: 100,
		},
		jobDescription: {
			type: String,
			required: [true, "Please provide job description"],
			maxlength: 10000,
			default: "Job Description",
		},
		status: {
			type: String,
			enum: ["interview", "declined", "pending"],
			default: "pending",
		},
		jobType: {
			type: String,
			enum: ["full-time", "part-time", "remote", "internship"],
			default: "full-time",
		},
		jobLocation: {
			type: String,
			default: "Denver, CO",
			required: true,
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: [true, "Please provide user"],
		},
		jobPostingURL: {
			type: String,
			maxlength: 100,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Job", JobSchema);
