import DevProjectCard from "./DevProjectCard";
import DevNavigation from "./DevNavigation"
import {useContext, useEffect, useState} from "react";
import {authErrorCheck, getSessionStorageExpire, signOut} from "../../../utils";
import axios from "axios";
import Loader from "../../Components/loader";
import {UserContext} from "../../../store";


const DevProjectsLayout = ({page, hamburgerClick}) => {
    const [projectData, setProjectData] = useState(null)
    const { userStore } = useContext(UserContext);

    useEffect(() => {
            let url
            switch (page) {
                case "Dashboard":
                    setProjectData(userStore.devProjects)
                    return;
                case "Explore":
                    url = "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/projectApp/get-all-projects"
                    break;
                case "Applications":
                    url = "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/applicationsApp/dev-get-applications"
                    break;
                default:
                    console.log("Page:", page)
                    // TODO: Redirect to dashboard
            }

            let token = getSessionStorageExpire("token")

            if (!token) {
                signOut()
                window.location.href = "/signin";
            }

            let config = { headers: { Authorization: `Bearer ${token}` } };
            let data;

            axios
                .get(url, config)
                .then((response) => {
                    data = response.data;
                    console.log(data)
                    setProjectData(data)
                    // stops the loop
                }).catch((err) => {
                    if (!err) {
                        console.log(err)
                    } else {
                        authErrorCheck(err);
                    }
                });
    }, []);

    if (!projectData) {
        return <Loader message="Hold on while we load the available projects" />;
    } else {
        let projectCards = []
        Object.entries(projectData).forEach(([projectId, projectData]) => {
            projectCards.push(<DevProjectCard projectId={projectId} projectData={projectData} page={page}/>)
        })

        return (
            <div className="panel-container">
                <DevNavigation hamburgerClick={hamburgerClick}/>
                <div className="curProject">
                    <h1 className="head">{page}</h1>
                    <div className="curProjectDisp">
                        {projectCards}
                    </div>
                </div>
            </div>
        )
    }
}

export default DevProjectsLayout