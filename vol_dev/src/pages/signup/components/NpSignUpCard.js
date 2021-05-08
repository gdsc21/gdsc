import charity from "../img/charity_icon.svg";

const NpSignUpCard = ({ setSelection }) => {
    const setNonprofit = () => {
        setSelection("np");
    };

    return (
        <div className="choice__card" onClick={setNonprofit}>
            <img className="nonprof_img" src={charity} alt="keyboard" />
            <p className="ima">I'm a</p>
            <h3 className="title">Non-profit</h3>
            <p className="description">
                I would like to find some amazing developers to work on my software project(s).
            </p>
        </div>
    )
}

export default NpSignUpCard