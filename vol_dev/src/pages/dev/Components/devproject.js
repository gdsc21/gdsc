const Devproject = (props) => {
    const project = props.project
    console.log(project)
    return ( 
        <div className="devproject">
            <h1>{project.org}</h1>
            <div>
                <h4>Title</h4><p className="title">{project.title}</p>
            </div>
            <div className="description-div">
                <h4>Description</h4><p className="description">{project.title}</p>
            </div>
            
            <div>
                <h4>Role</h4><p className="role">{project.role}</p>
            </div>
            <div className="progress">
                <h4>Progress</h4>
                <progress value={project.progress} max={100} />{project.progress}%<br/>
            </div>
            <a href="/"><span>Go to Page</span></a>
        </div>
     );
}
 
export default Devproject;