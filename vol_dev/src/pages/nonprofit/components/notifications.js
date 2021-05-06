import { Link } from "react-router-dom";
import {authErrorCheck, getSessionStorageExpire, signOut} from "../../../utils";
import axios from "axios";
import {useEffect, useState} from "react";
import Loader from "../../Components/loader";
import NpApplication from "./npApplication";


const NpNotifications = () => {
    const [applicationData, setApplicationData] = useState(null)

    useEffect(() => {
        // requests a Dev profile every 2 seconds until it succeeds or until 3 calls (6 seconds)
        let counter = 1;
        const fetchProjects = setInterval(() => {
            if (counter >= 3) clearInterval(fetchProjects);
            else ++counter;

            const url =
                "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/applicationsApp/np-get-applications";

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
                    setApplicationData(data)
                    // stops the loop
                    clearInterval(fetchProjects);
                })
                .then(() => {


                })
                .catch((err) => {
                    console.log(err)
                    // authErrorCheck(err);
                });
        }, 2000);
    }, []);

    if (!applicationData) {
        return <Loader message="Hold on while we load the available projects" />;
    } else {
        let projectCards = []
        Object.entries(applicationData).forEach(([projectId, projectData]) => {
            projectCards.push(<NpApplication projectId={projectId} projectData={projectData}/>)
        })

        return (
            <div className="np-curProject">
                <div className="curProject">
                    <h1 className="head">Your Applications</h1>
                    <div className="curProjectDisp">
                        {projectCards}
                    </div>
                </div>
            </div>
        );
    }
};

export default NpNotifications;