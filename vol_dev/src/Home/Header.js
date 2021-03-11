import React from 'react'
import {Link} from 'react-scroll'
import Logos from './Logos'
import gitLogo from './images/gitLogo.png'
import projectLogo from './images/projectLogo.png'
import pointLogo from './images/pointLogo.png'
import msgLogo from './images/msgLogo.png'
import ProjectDesc from './ProjectDesc'

 
const Header = () => {
    let images = [
        {
            img: gitLogo,
            description: "embedded github collaboration"
        },
        {
            img: projectLogo,
            description: "integrated project management"
        },
        {
            img: pointLogo,
            description: "point granting && redemption"
        },
        {
            img: msgLogo,
            description: "individual && group messaging"
        }
    ];
        return (
            <div className="home-info">
                <div className="bg">
                    <nav className='nav'>
                        <a href="/">home</a>
                        <a href="/"><Link to="/" smooth={true}>explore</Link></a>
                        <a href="/"><Link to="/" smooth={true}>sponsors</Link></a>
                        <a href="/"><Link to="/" smooth={true}>contact</Link></a>
                        <a href="/">sign in</a>
                        <a href="/">sign up</a>
                    </nav>
                    <div className="info">
                        <h1>WELCOME TO SOMETHING GREAT</h1>
                        <h2>A chance for non-profits to expand digitally, a chance for developers to do good.</h2>
                        <h4>At Something Something, we give developers the opportunity to write code for good. 
                            Our platform allows non-profits to create projects and find the perfect developers for them. 
                            Not only will every line of code written go towards a worthy cause, 
                            but we have a gamified system that awards our developers with amazing products and opportunities. </h4>
                    </div>
                    <a href="/" className="joinBtn"> Join Our Community</a>
                    <div className="logos-home">
                        {images.map(function(image, index) {
                            return(
                                <Logos key={index} image={image} />
                            )
                        })}  
                    </div>
                </div>
                <div className="projects-home">
                    <h1>Awesome Projects Built on Smth Smth </h1>
                    <div>
                    <ProjectDesc />
                    </div>    
                </div>
        </div>
    )
}
 
export default Header;