import {useContext, useEffect, useState} from "react";
import {authErrorCheck, getSessionStorageExpire, signOut} from "../../../../utils";
import axios from "axios";
import Loader from "../../../Components/loader";
import NpExploreProjectCard from "./NpExploreProjectCard";

const NpExplore = () => {
    const [pageData, setPageData] = useState(null)

    useEffect(() => {
        let url = "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/projectApp/get-all-projects"

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
                setPageData(data)
                // stops the loop
            }).catch((err) => {
            if (!err) {
                console.log(err)
            } else {
                authErrorCheck(err);
            }
        });
    }, [])

    if (!pageData) {
        return <Loader message="Hold on while we fetch your data" />;
    } else {

        let cards = []
        Object.entries(pageData).forEach(([projectId, projectData]) => {
            cards.push(<NpExploreProjectCard projectId={projectId} projectData={projectData} />)
        })

        return (
            <div className="np-curProject">
                {cards}
            </div>
        )
    }
}

export default NpExplore