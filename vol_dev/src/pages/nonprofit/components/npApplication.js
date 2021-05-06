import {getSessionStorageExpire, signOut} from "../../../utils";
import axios from "axios";

// projectId should be the projectID
const NpApplication = ({ projectId, projectData }) => {

    // const projectURL = project.id ? `/project/${project.id}` : "/";
    const projectURL = projectId ? `/project/${projectId}` : "/";

    const acceptDev = () => {
        let data = { devUid: Object.entries(projectData.developers)[0][0], projectId: projectId }

        // get token and if token is null redirect to sign in
        let token = getSessionStorageExpire("token");
        if (!token) {
            signOut()
            window.location.href = "/signin";
        }

        let config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // const url =
        // 	"https://us-central1-sunlit-webbing-305321.cloudfunctions.net/applicationsApp/apply-project";
        const url = "http://localhost:5001/sunlit-webbing-305321/us-central1/applicationsApp/accept-dev"

        axios
            .post(url, data, config)
            .then((response) => {
            })
            .catch((err) => {
                console.log(err);
                console.warn("Error:", err);
            });
    }

    return (
        <div className="devproject">
            <div>
                <h4>Title</h4>
                <p className="title">{projectData.projectInfo.projTitle}</p>
            </div>

            <div className="description-div">
                <h4>Description</h4>
                <p className="description">{projectData.projectInfo.projDescription}</p>
            </div>

            <div className="dev-application-status">
                <h4>{ projectData.appStatus ? projectData.appStatus : "pending"}</h4>
            </div>

            {/*
			// TODO: There are no roles for projects yet but we need to add the github repo link and the non-profits name
			<div>
				<h4>Role</h4>
				<p className="role">{project.role}</p>
			</div>
			*/}

            {
                // TODO: Add a way to quantify the project's progess
                // <div className="progress">
                // 	<h4>Progress</h4>
                // 	<progress value={project.progress} max={100} />
                // 	{project.progress}%
                // </div>
                // TODO: Add a link that takes you to that project component which makes a request to get the project from its id
                // Currently, it takes you to the project's id, and ot the homepage if it's not there
            }

            {/*<Link className="goto-btn" to={projectURL}>*/}
            {/*	Go to DevProjectModal*/}
            {/*</Link>*/}
            <div className="goto-btn" onClick={acceptDev}>
                Accept Developer
            </div>
        </div>
    );
};

export default NpApplication;