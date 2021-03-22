import axios from 'axios';
import { useState } from "react";


const devSignup = () => {
    const [Website, setWebsite] = useState("")
    const [LinkedIn, setLinkedIn] = useState("")
    const [GitHub, setGitHub] = useState("")

    const createDevProfile = (e) => {
        e.preventDefault()

        const url = "https://us-central1-sunlit-webbing-305321.cloudfunctions.net/userRoutes/dev-create-profile"
        const config = {
            headers: {
                // TODO: pass the token to this component
                Authorization: `Bearer ${token}`
            }
        }
        const data = {
            devWebsite: Website,
            devLinkedIn: LinkedIn,
            devGitHub: GitHub
        }

        axios
            .post(url, data, config)
            .then((response) => {
                // TODO: success -- redirect to dashboard
            })
            .catch((err) => {
                // TODO: Error - account was created in Firebase but the associated developer document was not
                // Poll to retry profile completion
            })
    }
}