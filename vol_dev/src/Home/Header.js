import React from 'react'
import {Link} from 'react-scroll'
 
const Header = () => {
        return (
        <div className="home-info">
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
        <div className="info">
            <h1>WELCOME TO SOMETHING GREAT</h1>
            <h2>A chance for non-profits to expand digitally, a chance for developers to do good.</h2>
            <h4>At Something Something, we give developers the opportunity to write code for good. 
                Our platform allows non-profits to create projects and find the perfect developers for them. 
                Not only will every line of code written go towards a worthy cause, 
                but we have a gamified system that awards our developers with amazing products and opportunities. </h4>
        </div>
        <a href="/"> Join Our Community</a>
        <div className="projects-home">
            <h1>Awesome Projects Built on Smth Smth </h1>
        </div>
        </div>
    )
}
 
export default Header;