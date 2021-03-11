import React from 'react'
import Header from './Header'
import Sponsors from './Sponsors'
import Connect from './Connect'
import Footer from './Footer'
import './styles/homepage.css'
 
const Home = () => {
    return (
        <div>
            <Header />
            <Sponsors />
            <Connect />
            <Footer />
        </div>
    )
}
 
export default Home;