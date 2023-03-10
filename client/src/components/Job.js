import JobInfo from "./JobInfo";
import moment from "moment";
import {
	FaLocationArrow,
	FaBriefcase,
	FaCalendarAlt,
	FaExternalLinkAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/Job";
import { ExternalLink } from "react-external-link";

const Job = ({
	_id,
	position,
	company,
	jobLocation,
	jobType,
	createdAt,
	status,
	jobPostingURL,
}) => {
	const { setEditJob, deleteJob, showJobDescription } = useAppContext();
	let date = moment(createdAt);
	date = date.format("Do MMM, YYYY");
	return (
		<Wrapper>
			<header>
				<div className="main-icon">{company.charAt(0)}</div>
				<div className="info">
					<h5>{position}</h5>
					<p>{company}</p>
				</div>
			</header>
			<div className="content">
				<div className="content-center">
					<JobInfo
						icon={<FaLocationArrow />}
						text={jobLocation}
						textClass="text"
					/>
					<JobInfo icon={<FaCalendarAlt />} text={date} textClass="text" />
					<JobInfo icon={<FaBriefcase />} text={jobType} textClass="text" />
					<ExternalLink href={jobPostingURL}>
						<JobInfo icon={<FaExternalLinkAlt />} text="Job Listing" />
					</ExternalLink>
					<div className={`status ${status}`}>{status}</div>
				</div>
				<footer>
					<div className="actions">
						<Link
							className="btn edit-btn"
							to="/add-job"
							onClick={() => {
								setEditJob(_id);
							}}
						>
							Edit
						</Link>
						<button
							type="button"
							className="btn delete-btn"
							onClick={() => deleteJob(_id)}
						>
							Delete
						</button>
						<button
							type="button"
							className="btn btn-info"
							onClick={() => showJobDescription(_id)}
						>
							Job Description
						</button>
					</div>
				</footer>
			</div>
		</Wrapper>
	);
};
export default Job;
