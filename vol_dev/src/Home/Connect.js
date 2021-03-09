import React from "react";

const Connect = () => {
    return (
        <div>
            <p>questions, comments, concerns?</p>
            <h5>let's connect!</h5>
            <label htmlFor="connect-name" />
            <input type="text" id="connect-name"/>
            <label htmlFor="connect-email" />
            <input type="text" id="connect-email"/>
            <label htmlFor="connect-subject" />
            <input type="text" id="connect-subject"/>
            <label htmlFor="connect-message" />
            <input type="text" id="connect-message"/>
            <a href="/">submit</a>
        </div>
    )
}
export default Connect;