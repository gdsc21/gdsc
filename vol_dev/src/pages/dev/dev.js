import Sidebar from "./Components/sidebar"
import userDetails from './Components/data/userDetails'
import ProjectPanel from "./Components/projectPanel"
const Dev = () => {
	const user = userDetails
	console.log(user[0].name)
	return (
		<div className="dev">
			<Sidebar user={user[0]}/>
			<ProjectPanel user={user[0]} />
		</div>);
};

export default Dev;
