import Achievements from "./achievements"

const Sidebar = (props) => {
    const user = props.user
    return (
        <div className="sidebar">
            <h6>edit info</h6>
            <img src="/"/>
            <h1>{user.name}</h1>
            <h3>{user.title}</h3>
            <Achievements user={user} />
            <div><a href="/">sign out</a></div>
        </div>
    )
}
export default Sidebar;