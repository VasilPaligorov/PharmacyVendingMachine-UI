import React from "react";
import { toast } from "react-toastify";
import '../../../css/showPrescriptions.css';

class ShowPrescriptions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            platform: navigator.userAgentData.platform,
            validData: "",
            invalidData: "",
            admin: false,
            doctor: true,
            patient: false,
            data: ""
        };
    }

    componentDidMount() {
        let user = 'doctor';
        if (this.state.platform === "Android" || this.state.platform === "iOS") {
            user = 'patient';
            this.setState({ patient: true });
            this.setState({ doctor: false });
        }
        if (localStorage.getItem("email") === "admin") {
            this.setState({ admin: true })
            this.setState({ doctor: false });
            user = 'all';
        }
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem("email") + ":" + localStorage.getItem("password")));
        headers.set('Content-Type', 'application/json');
        fetch("http://localhost:8081/prescriptions/" + user, {
            headers: headers
        })
            .then(response => response.json())
            .then(data => {
                let ValidData = [];
                let InvalidData = [];
                data.forEach(element => {
                    if (element.valid)
                        ValidData.push(element)
                    else
                        InvalidData.push(element)
                })
                if (ValidData.length !== 0)
                    this.setState({ validData: ValidData });
                if (InvalidData.length !== 0)
                    this.setState({ invalidData: InvalidData });
            });
    }

    setOnClick(event) {
        if (event.target.nextSibling.style.display === 'none')
            event.target.nextSibling.style.display = 'block';
        else
            event.target.nextSibling.style.display = 'none';
    }

    setDelete(id) {
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem('email') + ":" + localStorage.getItem('password')));
        headers.set('Content-Type', 'application/json');
        fetch("http://localhost:8081/prescriptions", {
            method: "DELETE",
            headers: headers,
            body: JSON.stringify(id)

        }).then(r => {
            if (r.status === 200) {
                toast.success("Prescription deleted!");
                window.location.reload()
            } else
                toast.error("Something unexpected happened! Try again!");
        })
    }

    setChangeValid(id, valid) {
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem('email') + ":" + localStorage.getItem('password')));
        headers.set('Content-Type', 'application/json');
        fetch("http://localhost:8081/prescriptions?valid=" + valid, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(id)

        }).then(r => {
            if (r.status === 200) {
                toast.success("Done! Prescription 'valid' state changed!");
                window.location.reload()
            } else
                toast.error("Something unexpected happened! Try again!");
        })
    }

    setFulfillPrescription(id) {
        let headers = new Headers();
        headers.set('Content-Type', 'application/json');
        console.log(sessionStorage.getItem('machineIP'));
        fetch(sessionStorage.getItem('machineIP') + "/executor?fetch=true&id=" + id, {
            method: "POST",
            headers: headers
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 0) {
                    toast.info(data.message + " Your prescription will be completed soon!");
                    window.location.reload()
                } else
                    toast.error(data.message);

            })
    }

    render() {
        return (<div className="content" id="showPresriptions" >
            <h1>Prescriptions:</h1>
            <hr></hr>
            <div id="valid">
                <h2>Valid Prescriptions:</h2>
                {
                    this.state.validData ?
                        this.state.validData.map(element =>
                            <div>
                                <button className="btn"
                                    onClick={(event) => this.setOnClick(event)}>{"Prescription " + element.id + " to: " + element.patient}</button>
                                <div style={{ display: 'none' }}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>name</th>
                                                <th>amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {element.medicines.map(medicine =>
                                                <tr>
                                                    <td>{medicine.name}</td>
                                                    <td>{medicine.quantity}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    {this.state.doctor ?
                                        <>
                                            <button className="btn2 red"
                                                onClick={() => this.setChangeValid([element.id], false)}>Make
                                                Prescription Invalid
                                            </button>
                                        </  >
                                        : <></>}
                                    {this.state.admin ?
                                        <button className="btn2 red" onClick={() => this.setDelete([element.id])}>Delete
                                            Prescription
                                        </button>
                                        : <></>
                                    }
                                    {(sessionStorage.getItem("machineIP") && !this.state.admin) ?
                                        <button className="btn2 green" onClick={() => this.setFulfillPrescription(element.id)}>Fulfill
                                            Prescription
                                        </button>
                                        : <></>
                                    }
                                </div>
                            </div>
                        )
                        : <p>You dont have valid prescriptions yet!</p>
                }
            </div>
            <div id="inValid">
                <h2>InValid Prescriptions:</h2>
                {
                    this.state.invalidData ?
                        this.state.invalidData.map(element =>
                            <>
                                <button className="btn"
                                    onClick={(event) => this.setOnClick(event)}>{"Prescription " + element.id + " to: " + element["patient"]}</button>
                                <div style={{ display: 'none' }}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>name</th>
                                                <th>amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {element.medicines.map(medicine =>
                                                <tr>
                                                    <td>{medicine.name}</td>
                                                    <td>{medicine.quantity}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    {this.state.doctor ?
                                        <>
                                            <button className="btn2 green"
                                                onClick={() => this.setChangeValid([element.id], true)}>Make
                                                Prescription Valid
                                            </button>
                                        </  >
                                        : <></>}
                                    {this.state.admin ?
                                        <button className="btn2 red" onClick={() => this.setDelete([element.id])}>Delete
                                            Prescription
                                        </button>
                                        : <></>
                                    }
                                </div>
                            </>
                        )
                        : <p>You dont have invalid prescriptions yet!</p>
                }
            </div>
        </div>)
    }
}

export default ShowPrescriptions;