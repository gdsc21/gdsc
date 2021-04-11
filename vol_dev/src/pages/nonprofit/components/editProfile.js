import {authErrorCheck, getSessionStorageExpire, signOut} from "../../../utils";
import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../../../store";

import Modal from "../../Components/modal";

const EditProfile = ({ showEditProfile, setShowEditProfile }) => {
    const { userStore, updateUserStore } = useContext(UserContext);

    // const [npDisplayName, setNpDisplayName] = useState(userStore.npDisplayName);
    const [npEmail, setNpEmail] = useState(userStore.npEmail);
    const [npWebsite, setNpWebsite] = useState(userStore.npWebsite);
    const [npCountry, setNpCountry] = useState(userStore.npCountry);
    const [npPhoneNumber, setNpPhoneNumber] = useState(userStore.npPhoneNumber);

    const editNpProfile = (e) => {
        e.preventDefault();

        let data = {
            npEmail: npEmail,
            npWebsite: npWebsite,
            npCountry: npCountry,
            npPhoneNumber: npPhoneNumber
        };

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

        const url =
            "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/npApp/np-update";

        axios
            .post(url, data, config)
            .then((response) => {
                // TODO: success -- close modal
                const getProfileUrl =
                    "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/npApp/get-np";
                axios
                    .get(getProfileUrl, config)
                    .then((newResponse) => {
                        data = newResponse.data;
                        updateUserStore({ type: "set", payload: data });
                    })
                    .catch((err) => {
                        authErrorCheck(err);
                    });
            })
            .catch((err) => {
                console.log(err);
                console.warn("Profile Update Error:", err);
            });
    };

    return (
        <Modal open={showEditProfile} setOpen={setShowEditProfile} title="Edit Profile">
            <form className="dev__edit-profile" onSubmit={editNpProfile}>

                <label htmlFor="Email">Email</label>
                <input
                    type="text"
                    name="devTitle"
                    placeholder="e.g. john_smith@gmail.com"
                    value={npEmail}
                    onChange={(e) => setNpEmail(e.target.value)}
                />

                <label htmlFor="website">Website</label>
                <textarea
                    type="text"
                    name="devBio"
                    maxLength="140"
                    placeholder="e.g. I like sunsets and long walks on the beach"
                    value={npWebsite}
                    onChange={(e) => setNpWebsite(e.target.value)}
                />

                <label htmlFor="country">Country</label>
                <input
                    type="text"
                    name="npCountry"
                    placeholder="e.g. Canada"
                    value={npCountry}
                    onChange={(e) => setNpCountry(e.target.value)}
                />

                <label htmlFor="phone number">Phone Number</label>
                <input
                    type="text"
                    name="devLinkedIn"
                    placeholder="e.g. linkedin.com/in/AdaLovelace"
                    value={npPhoneNumber}
                    onChange={(e) => setNpPhoneNumber(e.target.value)}
                />

                <div className="edit-profile__buttons">
                    <button
                        className="edit-profile__cancel"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowEditProfile(false);
                        }}
                    >
                        Cancel
                    </button>
                    <button className="edit-profile__save" type="submit">Save</button>
                </div>
            </form>
        </Modal>
    );
};

export default EditProfile;
