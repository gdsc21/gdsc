import React from "react";
import { Link } from "react-scroll";

const Footer = () => {
    return ( 
        <footer>
            <div>
                <a href="/"><Link to="/" smooth={true}>home</Link></a> <br/>
                <a href="/"><Link to="/" smooth={true}>explore</Link></a> <br/>
                <a href="/"><Link to="/" smooth={true}>sponsors</Link></a> <br/>
                <a href="/"><Link to="/" smooth={true}>contact</Link></a> <br/>
            </div>
            <div>
                <p>hello@something.com</p>
                <p>12345 Sesame St. <br/>
                Edmonton, AB A1B 2C3 <br/>
                Canada</p>
            </div>
            <p>Copyright © 2018 Something Something. All Rights Reserved.</p>
        </footer>
     );
}
 
export default Footer;