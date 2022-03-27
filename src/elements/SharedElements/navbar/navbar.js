import React from "react";

class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            init() {
                return 1;
            }
        }
    }

    render() {
        let platform = ""
        if (navigator.userAgentData.platform === "Android") {
            platform = "Mobile"
        }
        return (
            <>
                <a className="navbar-brand"><strong>Pharmacy Vending Machine {platform}</strong></a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent-6"
                        aria-controls="navbarSupportedContent-6" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent-6">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/login">Sign In<span
                                className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/register">Sign Up</a>
                        </li>
                    </ul>
                </div>
            </>
        )
    }
}

export default Navbar;