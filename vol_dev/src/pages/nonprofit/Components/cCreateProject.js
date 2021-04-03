import {useContext, useState} from "react";
import {getSessionStorageExpire} from "../../../utils";
import {UserContext} from "../../../store";
import axios from "axios";

const CCreateProject = () => {
    const { userStore, updateUserStore } = useContext(UserContext)

    const [projTitle, setProjTitle] = useState(null)
    const [projDescription, setProjDescription] = useState(null)

    const createProject = (e) => {
        let data = {
            projTitle: projTitle,
            projDescription: projDescription,
            projGithub: ""
        }
        // get token and if token is null redirect to sign in
        let token = getSessionStorageExpire("token");
        if (!token) window.location.href = "/signin";

        let config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const url =
            "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/userRoutes/create-project";

        axios
            .post(url, data, config)
            .then((response) => {
                if (!response.data.projectId) throw "projectId not returned"
                // TODO: success -- redirect to dashboard

                // the below code replicates the change in the np profile that occurs in firebase and allows for
                // immediate rendering of the new project ---- can be replaced by a get-profile API call
                let temp = userStore
                temp.npProjects[`${response.data.projectId}`] = data
                updateUserStore({type: "set", payload: temp})
            })
            .catch((err) => {
                console.log(err)
                try {
                    console.log(err.response.status)
                    console.log(err.response)
                } catch {}
            })
    }

    return ( 
        // <div className="create-modal">
        //     <h1>Create a new project</h1>
        //     <div>
        //         <h5>Title</h5>
        //         <input type="text"/>
        //     </div>
        //     <div>
        //         <h5>Description</h5>
        //         <input type="text"/>
        //     </div>
        //     <div>
        //         <h5>Role</h5>
        //         <input type="text"/>
        //     </div>
        //     <a href="/">Create Project</a>
        // </div>
        <form className="create-modal" onSubmit={createProject}>
            <label htmlFor="projTitle">Project Title</label>
            <input
                type="text"
                name="projTitle"
                placeholder="e.g. Salvation Army Website Redesign"
                value={projTitle}
                onChange={(e) => setProjTitle(e.target.value)}
            />

            <label htmlFor="projDescription">Project Description</label>
            <input
                type="text"
                name="projDescription"
                placeholder="e.g. Redesign the Salvation Army website and create an account system."
                value={projDescription}
                onChange={(e) => setProjDescription(e.target.value)}
            />
        </form>
     );
}
 
export default CCreateProject;