import React from "react";
import Header from "./components/header";
import Sponsors from "./components/sponsors";
import Connect from "./components/connect";
import Footer from "./components/footer";

const Home = () => {
	return (
		<div>
			<Header />
			<Sponsors />
			<Connect />
			<Footer />
		</div>
	);
};

export default Home;
