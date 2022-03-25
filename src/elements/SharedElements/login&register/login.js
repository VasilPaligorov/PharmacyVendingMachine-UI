import React from "react";
import "./../../../css/login.css";

import { toast } from 'react-toastify';

class Login extends React.Component {
    form;
    emailInput;
    passwordInput;

    constructor(props) {
        super(props);
        this.state = {
            email: "", password: "",
        };
        this.getEmail = this.getEmail.bind(this);
        this.getPassword = this.getPassword.bind(this);
    }

    componentDidMount() {
        sessionStorage.clear()
        const url = new URL(window.location.href)
        const params = new URLSearchParams(url.search)
        if (params.get('ip')) {
            let headers = new Headers();
            const machineIP = atob(params.get('ip'));
            headers.set('Content-Type', 'application/json');
            fetch(machineIP + "/configuration/status", {
                headers: headers
            })
                .then(response => response.json())
                .then(data => {

                    if (data === true) {
                        toast.success("Connection succeed!" + (window.localStorage.getItem("email") ? "" : "Please login to continue."))
                        sessionStorage.setItem('machineIP', machineIP);
                        if (window.localStorage.getItem('email'))
                            window.location.href = ("/showPrescriptions");
                    }
                    else
                        toast.error("Machine is offline.")
                }).catch(e => {
                    toast.error("Machine is offline.")
                });
        }
        else {
            if (window.localStorage.getItem('email'))
                window.location.href = ("/showPrescriptions");
        }
        
        this.form = document.querySelector('#create-account-form');
        this.emailInput = document.querySelector('#email');
        this.passwordInput = document.querySelector('#password');

    }


    getEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    };

    getPassword = (event) => {
        this.setState({
            password: event.target.value
        })
    };

    login() {
        this.validateForm();
        if (this.isFormValid() === true) {
            if (this.state.email === "admin@gmail.com" && this.state.password === "admin123") {
                window.localStorage.setItem('email', this.state.email);
                window.localStorage.setItem('password', this.state.password);
                window.location.href = ("/showPrescriptions");
            }
            let user = 'doctor';
            if (navigator.userAgentData.platform === "Android") user = 'patient';
            let headers = new Headers();
            headers.set('Authorization', 'Basic ' + btoa(this.state.email + ":" + this.state.password));
            headers.set('Content-Type', 'application/json');
            fetch("http://localhost:8081/users/" + user, {
                method: 'GET', headers: headers
            }).then(r => {
                if (r.status === 200) {
                    window.localStorage.setItem('email', this.state.email);
                    window.localStorage.setItem('password', this.state.password);
                    if (navigator.userAgentData.platform === "Android") window.location.href = ("/showPrescriptions"); else window.location.href = ("/createPrescription");
                } else {
                    this.setError(this.emailInput, "Email or password is incorrect.");
                    this.setError(this.passwordInput, "Email or password is incorrect.");
                }
            });
        }
    }


    validateForm() {
        if (this.state.email.trim() === '') {
            this.setError(this.emailInput, 'Provide email address');
        } else if (this.isEmailValid(this.state.email)) {
            this.setSuccess(this.emailInput);
        } else {
            this.setError(this.emailInput, 'Provide valid email address');
        }

        if (this.state.password.trim() === '') {
            this.setError(this.passwordInput, 'Password can not be empty');
        } else if (this.state.password.trim().length < 6 || this.state.password.trim().length > 16) {
            this.setError(this.passwordInput, 'Password must be 6-16 characters');
        } else {
            this.setSuccess(this.passwordInput);
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

    isEmailValid(email) {
        const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

        return re.test(email);
    }


    render() {
        return (
            <div id="login">
                <form id="create-account-form" className="content">
                    <div className="title">
                        <h2>Sign In</h2>
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" value={this.state.email} onChange={event => {
                            this.getEmail(event)
                        }} id="email"
                            placeholder="Email:" name="email" />
                        <p>Error Message</p>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" value={this.state.passwordInput} onChange={event => {
                            this.getPassword(event)
                        }} id="password" placeholder="Password:"
                            name="password" />
                        <p>Error Message</p>
                    </div>

                    <button type="button" className="btn" onClick={() => this.login()}>Submit</button>

                    <p>Not registered yet? <a href="/register">Sign Up!</a></p>
                </form>
            </div>
        )
    }
}

export default Login