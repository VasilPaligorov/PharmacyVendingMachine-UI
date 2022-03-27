import React from "react";

class LoggedInNavbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            platform: navigator.userAgentData.platform,
        }
    }

    removeSession() {
        sessionStorage.clear();
        localStorage.clear();
    }

    removeMachineIP() {
        sessionStorage.removeItem("machineIP");
    }

    isAdmin() {
        if (localStorage.getItem('email') === 'admin@gmail.com')
            return true
        else
            return false
    }

    getPlatform() {
        if (localStorage.getItem('email') === 'admin@gmail.com')
            return (
                <>
                    <li className="nav-item">
                        <a className="nav-link" href="/showPrescriptions">Show
                            Prescriptions</a>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Medicines
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <a className="dropdown-item" href="/createMedicine">Create global medicine</a>
                            <a className="dropdown-item" href="/showMedicines">Show global medicines</a>
                            {sessionStorage.getItem('machineIP') ?
                                <>
                                    <hr />
                                    <a className="dropdown-item" href="/addMedicineToMachine">Add medicine to machine</a>
                                    <a className="dropdown-item" href="/showMachineMedicines">Show medicines in machine</a>
                                </>
                                :
                                <></>
                            }
                        </div>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/showBugs"> Show Bugs</a>
                    </li>
                </>
            )
        else {
            if (this.state.platform === "Android")
                return (
                    <>
                        <li className="nav-item">
                            <a className="nav-link" href="/showPrescriptions">Show
                                Prescriptions</a>
                        </li>
                        {sessionStorage.getItem('machineIP') ? <>
                            <li className="nav-item">
                                <a className="nav-link" href="/createOrder">Order medicines</a>
                            </li>
                        </> :
                            <></>
                        }
                    </>
                )
            else
                return (
                    <>
                        <li className="nav-item">
                            <a className="nav-link" href="/createPrescription">Create
                                Prescription <span
                                    className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/showPrescriptions">Show
                                Prescriptions</a>
                        </li>
                    </>
                )
        }
    }

    render() {
        return (
            <>
                <a className="navbar-brand" href="/"><strong>Pharmacy Vending Machine</strong></a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent-6"
                    aria-controls="navbarSupportedContent-6" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent-6">
                    <ul className="navbar-nav">
                        {this.getPlatform()}
                    </ul>
                    <ul className="navbar-nav">
                        {sessionStorage.getItem('machineIP') ? <>
                            <li className="nav-item">
                                <a className="nav-link" href="/showPrescriptions" onClick={() => this.removeMachineIP()}>Disconnect from machine</a>
                            </li>
                        </> :
                            <></>
                        }
                        <li className="nav-item">
                            <a className="nav-link" href="/login" onClick={() => this.removeSession()}>Logout <span
                                className="sr-only">(current)</span></a>
                        </li>
                        {!this.isAdmin() ?
                            <li className="nav-item">
                                <a className="nav-link" href="/reportABug">Report A
                                    Bug</a>
                            </li>
                            : <></>}
                    </ul>
                </div>
            </>
        )

    }
}

export default LoggedInNavbar