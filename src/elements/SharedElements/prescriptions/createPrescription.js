import React from "react";
import { toast } from "react-toastify";
import '../../../css/createPrescription.css'

class CreatePrescription extends React.Component {
    medicineInput;
    emailInput;
    numberInput;

    constructor(props) {
        super(props);
        this.state = {
            email: "", medicine: "", number: "", medicines: [],
        };
        this.getEmail = this.getEmail.bind(this);
        this.getMedicine = this.getMedicine.bind(this);
        this.getNumber = this.getNumber.bind(this);
    }

    componentDidMount() {
        this.medicineInput = document.querySelector('#medicine');
        this.emailInput = document.querySelector('#patient');
        this.numberInput = document.querySelector('#number');
    }


    getEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    };

    getMedicine = (event) => {
        this.setState({
            medicine: event.target.value
        })
    };
    getNumber = (event) => {
        this.setState({
            number: event.target.value
        })
    };


    componentWillMount() {
        let names = [];
        const url = new URL(window.location.href);
        let headers = new Headers();
        headers.set('Content-Type', 'application/json');
        if (url.pathname === '/createOrder') {
            fetch(sessionStorage.getItem('machineIP') + "/medicines?prescription=no", {
                headers: headers,
            })
                .then(response => response.json())
                .then(data => {
                    data.forEach(element => {
                        names.push(element.name)
                    })
                    names.sort();
                    this.setState({ medicines: names })
                })
        }
        else {
            headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem('email') + ":" + localStorage.getItem('password')));
            fetch("http://localhost:8081/medicines", {
                headers: headers,
            })
                .then(response => response.json())
                .then(data => {
                    data.forEach(element => {
                        names.push(element.name)
                    })
                    names.sort();
                    this.setState({ medicines: names })
                })
        }

    }

    createPrescriptionRow() {
        this.validateMedicine(this.medicineInput, this.numberInput);
        if (this.isFormValid()) {
            const table = document.querySelector("#prescription");
            const newRow = document.createElement("tr");
            const array = [this.medicineInput, this.numberInput, 1];
            array.forEach(element => {
                const newElement = document.createElement("td");
                if (element === 1) {
                    const newButton = document.createElement("button");
                    newButton.classList.add("rmvBtn");
                    newButton.innerText = "remove";
                    newButton.onclick = () => newRow.parentNode.removeChild(newRow);
                    newElement.appendChild(newButton);
                } else {
                    newElement.classList.add("pr")
                    newElement.innerText = element.value;
                }
                newRow.appendChild(newElement);
            })
            table.appendChild(newRow);
        }
    }

    createPrescription() {
        this.validatePatient();
        if (this.isFormValid()) {
            let prescription = [];
            const data = document.querySelectorAll(".pr");
            for (let i = 0; i < data.length; i += 2) {
                prescription.push({
                    "name": data[i].innerText,
                    "amount": parseInt(data[i + 1].innerText)
                });
            }
            console.log(prescription);
            if (prescription.length !== 0) {
                let headers = new Headers();
                headers.set('Content-Type', 'application/json');
                if (sessionStorage.getItem('machineIP')) {
                    fetch(sessionStorage.getItem('machineIP') + "/executor?fetch=false", {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify(prescription)
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
                else {
                    headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem('email') + ":" + localStorage.getItem('password')));
                    fetch("http://localhost:8081/prescriptions?patient_email=" + this.state.email.trim(), {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify(prescription)

                    }).then(r => {
                        if (r.status === 200) {
                            toast.success("Prescription created!");
                            window.location.reload();
                        } else if (r.status === 404)
                            this.setError(this.emailInput, "Invalid patient");
                        else
                            toast.error("Something unexpected happened! Try again!");
                    })
                }
            }
        }
    }

    isFormValid() {
        const inputContainers = document.querySelectorAll('.wrapper');
        let result = true;
        inputContainers.forEach((container) => {
            if (container.classList.contains('error')) {
                result = false;
            }
        });
        return result;
    }

    validateMedicine(medicine, number) {
        if (!this.state.medicines.includes(medicine.value)) {
            this.setError(medicine, "Invalid medicine");
        } else
            this.setSuccess(medicine);

        if (number.value.trim() === '') {
            this.setError(number, "Enter a number");
        } else
            this.setSuccess(number);
    }

    setError(element, errorMessage) {
        const parent = element.parentElement;
        if (parent.classList.contains('success')) {
            parent.classList.remove('success');
        }
        parent.classList.add('error');
        const paragraph = parent.querySelector('p');
        paragraph.textContent = errorMessage;
    }

    setSuccess(element) {
        const parent = element.parentElement;
        if (parent.classList.contains('error')) {
            parent.classList.remove('error');
        }
        parent.classList.add('success');
    }

    validatePatient() {
        if (!sessionStorage.getItem('machineIP')) {
            if (this.state.email.trim() === '') {
                this.setError(this.emailInput, "Enter patient");
            } else
                this.setSuccess(this.emailInput);
        }
    }


    render() {
        return (
            <div className="content" id="createPrescription">
                <div className="container">
                    <h1>Create prescription:</h1>
                    <div className="topBar">

                        {!sessionStorage.getItem('machineIP') ?
                            <div className="wrapper">
                                <label htmlFor="patient">patient email</label>
                                <input name="patient" alue={this.state.email} onChange={event => {
                                    this.getEmail(event)
                                }} id="patient" autoComplete="off" placeholder="Enter patient email:" />
                                <p>Error Message</p>
                            </div> :
                            <></>
                        }

                        <div className="wrapper">
                            <label htmlFor="medicine">medicine</label>
                            <input list="medicines" name="medicine" value={this.state.medicineInput} onChange={event => {
                                this.getMedicine(event)
                            }} id="medicine" autoComplete="off"
                                placeholder="Choose medicine:" />
                            <datalist id="medicines">
                                {this.state.medicines.map(element =>
                                    <option value={element} />
                                )}
                            </datalist>
                            <p>Error Message</p>
                        </div>

                        <div className="wrapper">
                            <label htmlFor="number">number</label>
                            <input type="number" name="number" value={this.state.number} onChange={event => {
                                this.getNumber(event)
                            }} id="number" placeholder="Number of medicines:"
                                autoComplete="off" />
                            <p>Error Message</p>
                        </div>

                        <button className="btn" onClick={() => this.createPrescriptionRow()}>Add</button>
                    </div>
                    <div className="line" />
                    <div className="tableContainer">
                        <table id="prescription">
                            <thead>
                                <tr>
                                    <th>Medicine</th>
                                    <th>Number</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                    <button className="btn last" type="button" onClick={() => this.createPrescription()}>Create Prescription</button>
                </div>
            </div>
        )
    }
}

export default CreatePrescription;