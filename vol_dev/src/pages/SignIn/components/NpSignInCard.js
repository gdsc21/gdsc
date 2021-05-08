import charity from "../img/charity_icon.svg";

const NpSignInCard = ({ setSelection }) => {
    const setNonprofit = () => {
        setSelection("np");
    };

    return (
        <div className="choice__card" onClick={setNonprofit}>
            <img className="nonprof_img" src={charity} alt="keyboard" />
            <p className="ima">sign in as a</p>
            <h3 className="title">Non-profit</h3>
        </div>
    )
}

export default NpSignInCard