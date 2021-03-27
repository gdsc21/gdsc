import {Link} from "react-router-dom";

const StarredProject = ({ project }) => {
    return (
        <div className="achievements">
            <div className="starproject">
                <h3>Starred Project</h3>
                {project.starProject ? (
                    // If the current user has a starred project, display it
                    <div className="proj">
                        <div className="proj-details">
                            <h4>{project.starProject.title}</h4>
                            <h5>{project.starProject.org}</h5>
                        </div>

                        <div className="proj-icon">
                            {/* // TODO: add links to these icons */}

                            <Link to="/" name="project page">
                                <i className="fa fa-info"></i>
                            </Link>

                            <Link to="/" name="github page">
                                <i className="fab fa-github"></i>
                            </Link>
                        </div>
                    </div>
                ) : (
                    //otherwise, add a link to add your starred project
                    <div className="no-starred">
                        <h5>You currently have no starred project</h5>
                        <p>To add a starred project, select "star" on your desired project's page</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StarredProject