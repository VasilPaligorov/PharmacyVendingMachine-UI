import React from "react";

import { toast } from 'react-toastify';
import "../../../css/createMedicine.css"

class CreateMedicine extends React.Component {
    form;
    medicineInput;
    needsPrescriptionInput;
    amountInput;
    priceInput;
    slotInput

    constructor(props) {
        super(props);
        this.state = {
            medicine: "", needsPrescription: null, names: [], url: null, amount: '', price: '', currentMedicine: '', slotID: '', medicines: []
        };
        this.getMedicine = this.getMedicine.bind(this);
        this.getNeedsPrescription = this.getNeedsPrescription.bind(this);
        this.getAmount = this.getAmount.bind(this);
        this.getPrice = this.getPrice.bind(this);
        this.getSlotID = this.getSlotID.bind(this);
    }

    getMedicine = (event) => {
        this.setState({
            medicine: event.target.value
        })
    };

    getNeedsPrescription = (event) => {
        this.setState({
            needsPrescription: event.target.value
        })
    };

    getAmount = (event) => {
        this.setState({
            amount: event.target.value
        })
    };

    getPrice = (event) => {
        this.setState({
            price: event.target.value
        })
    };

    getSlotID = (event) => {
        this.setState({
            slotID: event.target.value
        })
    };

    componentDidMount() {
        const url = new URL(window.location.href);

        if (url.pathname === '/addMedicineToMachine') {
            this.setState({ pathname: url.pathname });
            let headers = new Headers();
            headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem("email") + ":" + localStorage.getItem("password")));
            headers.set('Content-Type', 'application/json');
            fetch("http://localhost:8081/medicines", {
                headers: headers,
            })
                .then(response => response.json())
                .then(data => {
                    let names = []
                    data.forEach(element => {
                        names.push(element.name)
                    })
                    names.sort();
                    this.setState({ names: names })
                    this.setState({ medicines: data.sort((a, b) => a.name.localeCompare(b.name)) })
                })
        }

    }

    createMedicine() {
        this.form = document.querySelector('#create-account-form');
        this.medicineInput = document.querySelector('#medicine');
        this.needsPrescriptionInput = document.querySelector('#needsPrescription');
        this.amountInput = document.querySelector('#amount');
        this.priceInput = document.querySelector('#price');
        this.slotInput = document.querySelector('#slotID');

        this.validateForm();
        if (this.isFormValid() === true) {
            if (this.state.pathname) {
                let headers = new Headers();
                headers.set('Content-Type', 'application/json');
                headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem('email') + ":" + localStorage.getItem('password')));
                fetch(sessionStorage.getItem("machineIP") + "/medicines", {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(
                        {
                            "name": this.state.medicine,
                            "price": this.state.price,
                            "amount": this.state.amount,
                            "needsPrescription": this.state.currentMedicine.needsPrescription
                        }
                    )

                }).then(r => {
                    if (r.status === 200) {
                        fetch(sessionStorage.getItem("machineIP") + "/configuration/router/mapping", {
                            method: "GET",
                            headers: headers,
                        })
                            .then(response => response.json())
                            .then(data => {
                                data.push({
                                    "medicineName": this.state.medicine,
                                    "slotID": parseInt(this.state.slotID)
                                })
                                fetch(sessionStorage.getItem("machineIP") + "/configuration/router/mapping", {                               
                                    method: "POST",
                                    headers: headers,
                                    body: JSON.stringify(data)
                                }).then(resp => {
                                    if (resp.status === 200) {
                                        toast.success("Medicine created!")
                                    } else {
                                        toast.error("Invalid slot ID")
                                        this.setError(this.slotInput, "This slot is already taken!")
                                        fetch(sessionStorage.getItem("machineIP") + '/medicines?name=' + this.state.medicine, {
                                            method: "DELETE",
                                            headers: headers
                                        })
                                    }
                                })
                            })
                    }
                    else if(r.status === 302){
                        fetch(sessionStorage.getItem("machineIP") + "/medicines?name=" + this.state.currentMedicine.name, {
                            method: "PUT",
                            headers: headers,
                            body: JSON.stringify(
                                {
                                    "name": this.state.currentMedicine.name,
                                    "price": this.state.price,
                                    "amount": this.state.amount,
                                    "needsPrescription": this.state.currentMedicine.needsPrescription
                                }
                            )

                        }).then(response => {
                            if (response.status === 200)
                                toast.success("Medicine updated");
                            else
                                toast.error("Something unexpected heppened! Try again.")
                        })
                    }
                    else
                        toast.error("Something unexpected heppened! Try again.")
                })

            } else {
                let headers = new Headers();
                headers.set('Content-Type', 'application/json');
                headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem('email') + ":" + localStorage.getItem('password')));
                fetch("http://localhost:8081/medicines", {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify([
                        {
                            "name": this.state.medicine,
                            "needsPrescription": this.state.needsPrescription
                        }
                    ])

                }).then(r => {
                    if (r.status === 200) {
                        toast.success("Medicine created!");
                    }
                    else if (r.status === 302) {
                        toast.error("Medicine already exists!");
                        this.setError(this.medicineInput, "Medicine already exists!")
                    }
                    else {
                        toast.error("Something unexpected happened! Try again.");
                        this.setError(this.medicineInput, "Something unexpected happened! Try again.")
                    }
                })
            }

        }
    }


    validateForm() {
        if (this.state.pathname) {
            if (!this.state.names.includes(this.state.medicine)) {
                this.setError(this.medicineInput, "Invalid medicine");
            } else {
                this.state.medicines.forEach((element) => {
                    if (element.name === this.state.medicine)
                        this.setState({ currentMedicine: element })
                })
                this.setSuccess(this.medicineInput);
            }

            if (this.state.amount.trim() === '') {
                this.setError(this.amountInput, 'Enter amount');
            } else {
                this.setSuccess(this.amountInput)
            }

            if (this.state.price.trim() === '') {
                this.setError(this.priceInput, 'Enter price');
            } else {
                this.setSuccess(this.priceInput)
            }

            if (this.state.slotID.trim() === '') {
                this.setError(this.slotInput, 'Provide slot id');
            } else {
                this.setSuccess(this.slotInput)
            }
        }

        else {
            if (this.state.medicine.trim() === '') {
                this.setError(this.medicineInput, 'Provide medicine');
            } else {
                this.setSuccess(this.medicineInput)
            }
            if (this.state.needsPrescription === null) {
                this.setError(this.needsPrescriptionInput, "Invalid input!");
            } else
                this.setSuccess(this.needsPrescriptionInput);
        }
    }


    isFormValid() {
        const inputContainers = this.form.querySelectorAll('.input-group');
        let result = true;
        inputContainers.forEach((container) => {
            if (container.classList.contains('error')) {
                result = false;
            }
        });
        return result;
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

    render() {
        return (
            <div id="login">
                <form id="create-account-form" className="content">
                    <div className="title">
                        <h2>Add medicines</h2>
                    </div>
                    {
                        this.state.pathname ?
                            <>
                                <div className="input-group">
                                    <label htmlFor="medicine">Medicine</label>
                                    <input list="medicines" name="medicine" value={this.state.medicineInput} onChange={event => {
                                        this.getMedicine(event)
                                    }} id="medicine" autoComplete="off"
                                        placeholder="Choose medicine:" />
                                    <datalist id="medicines">
                                        {this.state.names.map(element =>
                                            <option value={element} />
                                        )}
                                    </datalist>
                                    <p>Error Message</p>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="amount">Total amount</label>
                                    <input type="number" name="amount" value={this.state.amountInput} onChange={event => {
                                        this.getAmount(event)
                                    }} id="amount" autoComplete="off"
                                        placeholder="Amount:" />
                                    <p>Error Message</p>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="price">Medicine Price</label>
                                    <input type="number" step="0.01" name="price" value={this.state.priceInput} onChange={event => {
                                        this.getPrice(event)
                                    }} id="price" autoComplete="off"
                                        placeholder="Price:" />
                                    <p>Error Message</p>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="slotId">Slot ID</label>
                                    <input type="number" name="slotId" value={this.state.slotIput} onChange={event => {
                                        this.getSlotID(event)
                                    }} id="slotID" autoComplete="off"
                                        placeholder="Slot ID:" />
                                    <p>Error Message</p>
                                </div>
                            </>

                            : <>
                                <div className="input-group">
                                    <label htmlFor="medicine">medicine</label>
                                    <input name="medicine" value={this.state.medicineInput} onChange={event => {
                                        this.getMedicine(event)
                                    }} id="medicine" autoComplete="off"
                                        placeholder="Choose medicine:" />
                                    <p>Error Message</p>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="needsPrescription">Needs Prescription</label>
                                    <div id="needsPrescription">
                                        <button type="button" className="passive" onClick={(event) => { event.target.className = 'active'; event.target.nextSibling.className = 'passive'; this.setState({ needsPrescription: true }) }}>needs prescription</button>
                                        <button type="button" className="passive" onClick={(event) => { event.target.className = 'active'; event.target.previousSibling.className = 'passive'; this.setState({ needsPrescription: false }) }}>doesn't need prescription</button>
                                    </div>
                                    <p>Error Message</p>
                                </div>
                            </>
                    }

                    <button type="button" className="btn" onClick={() => this.createMedicine()}>Create Medicine</button>
                </form>
            </div>
        )
    }
}

export default CreateMedicine