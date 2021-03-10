import { useParams } from "react-router";

const Project = () => {
	let { id } = useParams();
	return (
		<div className="project">
			<h1>{id}</h1>
		</div>
	);
};

export default Project;
