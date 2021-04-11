import { Link } from "react-router-dom";
// import DevProfile from "./devProfile";
// import defaultNP from "./img/charity_icon.svg";
import { useParams } from "react-router-dom";

const Project = ({ user, hamburgerClick }) => {
	/*
	let { id } = useParams();

	const [npInfo, setnpInfo] = useState("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [devProfiles, setDevProfiles] = useState("");
	const [gitHubRepo, setGitHubRepo] = useState("");
	useEffect((id) => {
		const url =
			"https://us-central1-sunlit-webbing-305321.cloudfunctions.net/userRoutes/get-project";
		let token = getSessionStorageExpire("token");
		let config = {
			headers: { Authorization: `Bearer ${token}` },
			params: { projectId: id },
		};
		axios
			.get(url, config)
			.then((response) => {
				let data = response.data;
				setnpInfo(data.npInfo);
				setTitle(data.title);
				setDescription(data.description);
				setDevProfiles(data.devProfiles);
				setGitHubRepo(data.GitHubRepo);
			})
			.catch((response) => {
				if (response.data.message === "Profile doesn't exists!") {
				} // TODO: Profile doesn't exist error handling
				else {
					// TODO: Server error handling
				}
			});
	}, []);
	*/

	return (
		<div className="panel-container">
			{/* Nav and menu */}
			<div className="ham-header">
				<button className="hamburger" onClick={hamburgerClick}>
					<i className="fas fa-bars"></i>
				</button>
				<div className="devNav">
					{
						//TODO: add messaging
					}
					<Link to="/dashboard">
						<span className="navlink__text">Dashboard</span>
						<i className="navlink__icon fas fa-home"></i>
					</Link>
					<Link to="/">
						<span className="navlink__text">Notifications</span>
						<i className="navlink__icon fas fa-bell"></i>
					</Link>
					{/* <Link to="/">Messages</Link> */}
					<Link to="/explore">
						<span className="navlink__text">Explore</span>
						<i className="navlink__icon fas fa-compass"></i>
					</Link>
				</div>
			</div>

			{/* <div className="proj-and-np">
				<div className="proj">
					<h3 className="title">Project Information</h3>
					<div className="project-info">
						<span className="proj-title">{title}</span>
						<span className="github">
							<a href={gitHubRepo}>
								<i class="fab fa-github"></i>
							</a>
						</span>
						<h4 className="subtitle">Description</h4>
						<p>{description}</p>
					</div>
				</div>
				<div className="np">
					<h3 className="title">Non-Profit Information</h3>
					<div className="non-profit">
						<img src={npInfo.npLogo || defaultNP} alt="" className="logo" />
						<h4>{npInfo.npDisplayName}</h4>
						<div className="np-links">
							{npInfo.npWebsite && (
								<a href={npInfo.npWebsite}>
									<i class="fas fa-globe"></i>
								</a>
							)}
							{npInfo.npEmail && (
								<a href={`mailto:${npInfo.npEmail}`}>
									<i class="fas fa-envelope"></i>
								</a>
							)}
						</div>
					</div>
				</div>
			</div>
			<h3 className="title">Developers on this project</h3>
			<div className="developers">
				{Object.entries(devProfiles).map(([key, value]) => (
					<DevProfile user={value} />
				))}
			</div> */}
		</div>
	);
};

export default Project;
