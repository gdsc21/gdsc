import React from 'react'

const Logos = (props) => {
    const img = props.image.img
    const description = props.image.description
    return ( 
        <div>
            <img src={img} />
            <p>{description}</p>
        </div>
     );
}
 
export default Logos;