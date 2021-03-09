import React from 'react'
import {Link} from 'react-scroll'
 
const Header = () => {
        return (
        <header className="header">
            <nav className='nav'>
                <div className='navbar'>
                    <a href="/">home</a>
                    <a href="/"><Link to="/" smooth={true}>explore</Link></a>
                    <a href="/"><Link to="/" smooth={true}>sponsors</Link></a>
                    <a href="/"><Link to="/" smooth={true}>contact</Link></a>
                    <a href="/">sign in</a>
                    <a href="/">sign up</a>
                </div>
            </nav>
        </header>
    )
}
 
export default Header;