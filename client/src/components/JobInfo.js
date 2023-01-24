import Wrapper from "../assets/wrappers/JobInfo";

const JobInfo = ({ icon, text, textClass }) => {
	return (
		<Wrapper>
			<span className="icon">{icon}</span>
			<span className={textClass}>{text}</span>
		</Wrapper>
	);
};
export default JobInfo;
