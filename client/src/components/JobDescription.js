import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/JobDescription";

const JobDescription = ({}) => {
	const { toggleJobDescription, jobDescription, displayJobDescription, job } =
		useAppContext();

	return (
		displayJobDescription && (
			<Wrapper>
				<div className="job-description">
					<h1>{job.company}</h1>
					<h3>{job.position}</h3>
					<p>{jobDescription}</p>
					<button
						type="button"
						className="btn delete-btn"
						onClick={() => toggleJobDescription()}
					>
						Close
					</button>
				</div>
			</Wrapper>
		)
	);
};
export default JobDescription;
