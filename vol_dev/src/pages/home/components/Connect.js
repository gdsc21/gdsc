import React from "react";

const Connect = () => {
    return (
        <div>
            <p>questions, comments, concerns?</p>
            <h5>let's connect!</h5>
            <label htmlFor="connect-name">Name</label><br/>
            <input type="text" id="connect-name"/><br/>
            <label htmlFor="connect-email">Email</label><br/>
            <input type="text" id="connect-email"/><br/>
            <label htmlFor="connect-subject">Subject</label><br/>
            <input type="text" id="connect-subject"/><br/>
            <label htmlFor="connect-message">message</label><br/>
            <input type="text" id="connect-message"/><br/>
            <a href="/">submit</a>
        </div>
    )
}
export default Connect;