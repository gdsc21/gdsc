import Devproject from "./devproject"
const ProjectPanel = (props) => {
    const user = props.user
    let hamburgerClick = props.hamburger;
    return ( 
        <div className="panel-container">
            <div className="ham-header">
            <button className="hamburger" onClick={hamburgerClick}>
                <i className="fas fa-bars"></i>
            </button>
            <nav className="devNav">
                <a href="/">Dashboard</a>
                <a href="/">Notifications</a>
                <a href="/">Messages</a>
                <a href="/">Explore</a>
            </nav>
            </div>
            <div className="curProject">
                <h1 className="head">Current Projects</h1>
                <div className="curProjectDisp">
                    {user.projects.map((project, id)=> {
                        return (
                            <Devproject key={id} project={project} />
                        )
                    })}
                </div>
            </div>
            <div className="interestProject">
                <h1 className="head">Projects that may interest you</h1>
                <div className="intProjectDisp">
                    {user.interestProjects.map((project, id)=> {
                        return (
                            <Devproject key={id} project={project} />
                        )
                    })}
                </div>
            </div>
        </div>
     );
}
 
export default ProjectPanel;