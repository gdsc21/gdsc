

const DevProfileCard = ({ devUid, devProfile }) => {
    return (
        <div className="dev-profile">
            <img src={devProfile.devProfileImgUrl} className="dev-image" alt="developer profile" />
            <h4 className="dev-name">{devProfile.devDisplayName}</h4>
            <div className="dev-links">
                {devProfile.devLinks.devWebsite && (
                    <a href={devProfile.devLinks.devWebsite}>
                        <i class="fas fa-globe"></i>
                    </a>
                )}

                {devProfile.devLinks.devGitHub && (
                    <a href={devProfile.devLinks.devGitHub}>
                        <i class="fab fa-github"></i>
                    </a>
                )}

                {devProfile.devLinks.devLinkedIn && (
                    <a href={devProfile.devLinks.devLinkedIn}>
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                )}
            </div>
        </div>
    );
};

export default DevProfileCard;