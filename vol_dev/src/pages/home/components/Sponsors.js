import React from "react";
import "../styles/homepage.css";

const Sponsors = () => {
	return (
		<div name="sponsors" className="sponsors">
			<h1 className="title">Our Sponsors</h1>
			<div className="sponsor-logos"></div>
			<p className="description">
				Our sponsors make it so many amazing matches happen. By sponsoring, you encourage our
				developers by providing incentives to write code for good. You may sponsor us finiancially
				or by providing products and/or services to our developers.
			</p>
			<p className="action">
				If you would like to support us, you can fill out our contact form and we can chat!
			</p>
		</div>
	);
};

export default Sponsors;
