import {useEffect, useState} from "react";
import {authErrorCheck, getSessionStorageExpire, signOut} from "../../../../utils";
import axios from "axios";
import Loader from "../../../Components/loader";
import NpDevApplicationCard from "./NpDevApplicationCard";

const NpApplications = () => {
    const [pageData, setPageData] = useState(null)

    useEffect(() => {
        let url = "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/applicationsApp/np-get-applications"

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
            }).catch((err) => {
            if (!err) {
                console.log(err)
            } else {
                authErrorCheck(err);
            }
        });
    }, [])

    if (!pageData) {
        return <Loader message="Hold on while we fetch applications to your projects" />;
    } else {

        let cards = []
        Object.entries(pageData).forEach(([projectId, projectData]) => {
            let devApps = []
            Object.entries(projectData.developers).forEach(([devUid, devData]) => {
                devApps.push(<NpDevApplicationCard key={devUid} devUid={devUid} devData={devData} />)
            })
            cards.push(<div key={projectId} className="np-curProject">{devApps}</div>)
        })

        return (
            <div>
                {cards}
            </div>
        )
    }
}

export default NpApplications
