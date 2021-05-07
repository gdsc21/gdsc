import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../../../store";
import Loader from "../../../Components/loader";
import NpDashboardProjectCard from "./NpDashboardProjectCard";

const NpDashboard = () => {
    const [pageData, setPageData] = useState(null)
    const { userStore } = useContext(UserContext)

    useEffect(() => {
        setPageData(userStore.npProjects)
    }, [])

    if (!pageData) {
        return <Loader message="Hold on while we fetch your data" />;
    } else {

        let cards = []
        Object.entries(pageData).forEach(([projectId, projectData]) => {
            cards.push(<NpDashboardProjectCard projectId={projectId} projectData={projectData}/>)
        })

        return (
            <div className="np-curProject">
                {cards}
            </div>
        )
    }
}

export default NpDashboard