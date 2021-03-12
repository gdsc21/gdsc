import react from 'react'
import projectData from './projectData'

const ProjectDesc = () => {
    return ( 
        <div>
            {projectData.map(function(project){
                return(
                    <div>
                        <h3>{project.title}</h3>
                        <h4>{project.orgName}</h4>
                        <h5>Team</h5>
                        <p>{project.team}</p>
                        <h5>Description</h5>
                        <p>{project.description}</p>
                    </div>
                )
            })}
        </div>
     );
}
 
export default ProjectDesc;