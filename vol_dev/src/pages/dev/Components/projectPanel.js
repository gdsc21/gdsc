import Devproject from "./devproject"

const ProjectPanel = (props) => {
    const user = props.user
    return ( 
        <div className="panel-container">
            <nav className="devNav">
                <a href="/">Dashboard</a>
                <a href="/">Notifications</a>
                <a href="/">Messages</a>
                <a href="/">Explore</a>
            </nav>
            <div className="curProject">
                <h1>Current Projects</h1>
                {user.projects.map((project, id)=> {
                    return (
                        <Devproject key={id} project={project} />
                    )
                })}
            </div>
            <div className="interestProject">
                <h1>Projects that may interest you</h1>
                {user.interestProjects.map((project, id)=> {
                    return (
                        <Devproject key={id} project={project} />
                    )
                })}
            </div>
        </div>
     );
}
 
export default ProjectPanel;