import {Link} from 'react-router-dom'
const DevNav = () => {
    return ( 
        <nav className="np-devnav">
            <div><Link to="/dashboard"><span>Dashboard</span></Link></div>
            <div><Link to="/"><span>Notifications</span></Link></div>
            <div><Link to="/"><span>Messages</span></Link></div>
            <div><Link to="/explore"><span>Explore</span></Link></div>    
        </nav>
     );
}
 
export default DevNav;