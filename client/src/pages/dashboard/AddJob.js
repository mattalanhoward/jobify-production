import { FormRow, FormRowSelect, Alert, FormTextArea } from "../../components";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/DashboardFormPage";

const AddJob = () => {
	const {
		isLoading,
		isEditing,
		showAlert,
		displayAlert,
		position,
		company,
		jobLocation,
		jobPostingURL,
		jobType,
		jobDescription,
		jobTypeOptions,
		status,
		statusOptions,
		handleChange,
		clearValues,
		createJob,
		editJob,
	} = useAppContext();

	const handleJobInput = (e) => {
		handleChange({ name: e.target.name, value: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (
			!position ||
			!company ||
			!jobLocation ||
			!jobDescription ||
			!jobPostingURL
		) {
			displayAlert();
			return;
		}
		if (isEditing) {
			editJob();
			return;
		}
		createJob();
	};

	return (
		<Wrapper>
			<form className="form">
				<h3>{isEditing ? "edit job" : "add job"}</h3>
				{showAlert && <Alert />}
				<div className="form-center">
					{/*position*/}
					<FormRow
						type="text"
						name="position"
						value={position}
						handleChange={handleJobInput}
					/>
					{/*company*/}
					<FormRow
						type="text"
						name="company"
						value={company}
						handleChange={handleJobInput}
					/>
					{/*location*/}
					<FormRow
						type="text"
						labelText="Job Location"
						name="jobLocation"
						value={jobLocation}
						handleChange={handleJobInput}
					/>
					{/* job type */}
					<FormRowSelect
						name="status"
						value={status}
						handleChange={handleJobInput}
						list={statusOptions}
					/>

					{/* job status */}
					<FormRowSelect
						name="jobType"
						labelText="Job Type"
						value={jobType}
						handleChange={handleJobInput}
						list={jobTypeOptions}
					/>

					{/* job URL */}
					<FormRow
						name="jobPostingURL"
						labelText="Posting URL"
						value={jobPostingURL}
						handleChange={handleJobInput}
					/>
				</div>
				<div className="form-textarea-container">
					{/* job description */}
					<FormTextArea
						type="text"
						labelText="Job Description"
						name="jobDescription"
						value={jobDescription}
						handleChange={handleJobInput}
					/>
				</div>
				<div className="form-center">
					{/* button container */}
					<div className="btn-container">
						<button
							type="submit"
							className="btn btn-block submit-btn"
							onClick={handleSubmit}
							disabled={isLoading}
						>
							Submit
						</button>

						<button
							className="btn btn-block clear-btn"
							onClick={(e) => {
								e.preventDefault();
								clearValues();
							}}
						>
							clear
						</button>
					</div>
				</div>
			</form>
		</Wrapper>
	);
};
export default AddJob;
