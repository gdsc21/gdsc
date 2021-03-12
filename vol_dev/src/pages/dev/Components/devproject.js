const Devproject = (props) => {
    const project = props.project
    console.log(project)
    return ( 
        <div className="devproject">
            <h1>{project.org}</h1>
            <h4>Title</h4><h4 className="title">{project.title}</h4>
            <h4>Description</h4><h4 className="description">{project.title}</h4>
            <h4>Role</h4><h4 className="role">{project.role}</h4>
            <h4>Progress</h4>
            <p>{project.progress}%</p>
            <progress value={project.progress} max={100} /><br/>
            <a href="/">Go to Page</a>
        </div>
     );
}
 
export default Devproject;