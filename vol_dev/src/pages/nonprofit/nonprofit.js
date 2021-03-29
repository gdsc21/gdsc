import "./styles/np.css"
import { useState, useEffect } from "react";
import { getSessionStorageExpire } from "../../utils";
import axios from "axios";
import NP from "./Components/np";

const NonProfit = () => {
	// Dummy user details for frontend tests
	const user = require("./Components/data/userDetails").default;

	return (
		<div className="nonprofit">
			<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
				integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
				crossorigin="anonymous"
			/>
			<NP user={user}/>
		</div>
	);
};

export default NonProfit;
