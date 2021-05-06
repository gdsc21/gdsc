import {getSessionStorageExpire} from "../../../utils";
import axios from "axios";

const DevProjectCardBTN = ({btnText, type, projectId}) => {

    const clickBtn = () => {
        // get token and if token is null redirect to sign in
        let token = getSessionStorageExpire("token");
        if (!token) window.location.href = "/signin";

        let config = { headers: { Authorization: `Bearer ${token}` } };

        let data = {}
        let url
        switch (type) {
            case "Apply":
                data.projectId = projectId
                url = "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/applicationsApp/apply-project"
                break;
        }

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
        <div className="goto-btn" onClick={clickBtn}>
            {btnText}
        </div>
    )
}

export default DevProjectCardBTN