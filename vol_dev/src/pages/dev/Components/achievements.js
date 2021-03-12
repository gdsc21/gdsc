import webIcon from './icons/webIcon.png'
import infoIcon from './icons/infoIcon.png'
import codeIcon from './icons/codeIcons.png'

const Achievements = (props) => {
    const user = props.user
    return ( 
        <div className="achievements">
            <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>
            <div className="xp">
                <h3>Current XP level</h3>
                <h3>{level(user.points)}</h3>
                <progress value={(user.points%2000)/20} max={100} />
            </div>
            <div className="badges">
                <h3>Badges</h3>
                *insert logo* *insert logo*
            </div>
            <div className="starproject">
                <h3>Starred Projects</h3>
                {user.starProjects.map((project, id) =>{
                    return (
                        <div className="proj">
                            <h4>{project.title}</h4>
                            <h5>{project.org}</h5>
                            <a href="/"><img src={webIcon} /></a><a href="/"><img src={infoIcon} /></a><a href="/">
                                <img src={codeIcon} /></a>
                        </div>
                    )
                })}
            </div>
        </div>
     );
}

function level (xp) {
    if (xp>=6000) {
        return "Grandmaster"
    } else if (xp>=4000){
        return "Champion"
    } else if (xp>=2000) {
        return "Veteran"
    } else {
        return "Newbie"
    }
}
export default Achievements;