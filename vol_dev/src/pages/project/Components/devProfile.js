import defaultUser from "../defaultUser.png";

const DevProfile = ({ user }) => {
	return (
		<div className="dev-profile">
			<img src={user.imgURL || defaultUser} className="dev-image" />
			<h4 className="dev-name">{user.devDisplayName}</h4>
			<h5 className="dev-role">{user.role}</h5>
			<div className="dev-links">
				{user.devLinks.devWebsite && (
					<a href={user.devLinks.devWebsite}>
						<i class="fas fa-globe"></i>
					</a>
				)}

				{user.devLinks.devGitHub && (
					<a href={user.devLinks.devGitHub}>
						<i class="fab fa-github"></i>
					</a>
				)}

				{user.devLinks.devLinkedIn && (
					<a href={user.devLinks.devLinkedIn}>
						<i class="fab fa-linkedin-in"></i>
					</a>
				)}
			</div>
		</div>
	);
};

export default DevProfile;
