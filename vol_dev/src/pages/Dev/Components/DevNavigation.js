import {Link} from "react-router-dom";

const DevNavigation = (hamburgerClick) => {
    return (
        <div className="ham-header">
            <button className="hamburger" onClick={hamburgerClick}>
                <i className="fas fa-bars"></i>
            </button>
            <nav className="devNav">
                <Link to="/dashboard">
                    <span className="navlink__text">Dashboard</span>
                    <i className="navlink__icon fas fa-home"></i>
                </Link>
                <Link to="/applications">
                    <span className="navlink__text">Applications</span>
                    <i className="navlink__icon fas fa-bell"></i>
                </Link>
                <Link to="/explore">
                    <span className="navlink__text">Explore</span>
                    <i className="navlink__icon fas fa-compass"></i>
                </Link>
            </nav>
        </div>
    )
}

export default DevNavigation