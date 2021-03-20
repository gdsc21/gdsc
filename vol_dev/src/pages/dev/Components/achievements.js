import webIcon from './icons/webIcon.png'
import infoIcon from './icons/infoIcon.png'
import codeIcon from './icons/codeIcons.png'

const Achievements = (props) => {
    const user = props.user
    return ( 
        <div className="achievements">
            <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>
            <div className="xp">
                <h3>Current Xp level</h3>
                <h5>{level(user.points)}</h5>
                <div className="user-progress">
                    <progress value={(user.points%2000)/20} max={100} /> <h5>{user.points} PTS</h5>
                </div>
                <p>{2000-user.points%2000} pts until the next level: {level(user.points)}</p>
            </div>
            <div className="badges">
                <h3>Badges</h3>
                *insert logo* *insert logo*
            </div>
            <div className="starproject">
                <h3>Starred Project</h3>
                <div className="proj">
                    <div className="proj-details">
                        <h4>{user.starProject.title}</h4>
                        <h5>{user.starProject.org}</h5>
                    </div>
                    <div className="proj-icon">
                        <a href="/"><i class="fas fa-globe"></i></a>
                        <a href="/"><i class="fa fa-info" aria-hidden="true"></i></a>
                        <a href="/"><i class="fas fa-code"></i></a>
                    </div>
                </div>
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