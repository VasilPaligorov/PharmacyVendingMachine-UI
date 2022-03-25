import React from "react";

import { toast } from 'react-toastify';
import "../../../../css/createMedicine.css"

class CreateMedicine extends React.Component {
    form;
    medicineInput;
    needsPrescriptionInput;

    constructor(props) {
        super(props);
        this.state = {
            medicine: "", needsPrescription: null
        };
        this.getMedicine = this.getMedicine.bind(this);
        this.getNeedsPrescription = this.getNeedsPrescription.bind(this);
    }

    componentDidMount() {
        this.form = document.querySelector('#create-account-form');
        this.medicineInput = document.querySelector('#medicine');
        this.needsPrescriptionInput = document.querySelector('#needsPrescription');

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

    createMedicine() {
        this.validateForm();
        if (this.isFormValid() === true) {
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
                else
                    toast.error(r.message);
            })
        }
    }


    validateForm() {
        if (this.state.medicine.trim() === '') {
            this.setError(this.medicineInput, 'Provide email address');
        } else {
            this.setSuccess(this.medicineInput)
        }
        if (this.state.needsPrescription === null) {
            this.setError(this.needsPrescriptionInput, "Invalid input!");
        } else
            this.setSuccess(this.needsPrescriptionInput);
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
                        <h2>Sign In</h2>
                    </div>

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
                            <button type="button" className="passive" onClick={(event) => { event.target.className='active'; event.target.nextSibling.className =  'passive'; this.setState({ needsPrescription: true }) }}>needs prescription</button>
                            <button type="button" className="passive" onClick={(event) => { event.target.className='active'; event.target.previousSibling.className = 'passive'; this.setState({ needsPrescription: false }) }}>doesn't need prescription</button>
                        </div>
                        <p>Error Message</p>
                    </div>

                    <button type="button" className="btn" onClick={() => this.createMedicine()}>Create Medicine</button>
                </form>
            </div>
        )
    }
}

export default CreateMedicine