import styled from "styled-components";

const Wrapper = styled.section`
	border-radius: var(--borderRadius);
	width: 90%;
	min-height: 60%;
	max-height: 90%;
	overflow: auto;
	background: var(--white);
	padding: 3rem 2rem 4rem;
	box-shadow: var(--shadow-2);
	border: 1px solid var(--grey-100);
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 99;
	opacity: 1;

	h4 {
		margin-top: 0;
		color: red;
	}

	@media (min-width: 992px) {
		width: 60%;
		min-height: 50%;
		max-height: 90%;
	}
	@media (min-width: 1120px) {
	}
`;

export default Wrapper;
