import React from "react";
import "./../../../css/register.css";
import { toast } from 'react-toastify';


class Register extends React.Component {
    form;
    fullNameInput;
    emailInput;
    uinInput;
    workplaceInput;
    passwordInput;
    confirmPasswordInput;
    platform = navigator.userAgentData.platform;

    constructor(props) {
        super(props);
        this.state = {
            fullName: "", email: "", uin: "", workplace: "", password: "", confirmPassword: "",
        };
        this.getFullName = this.getFullName.bind(this);
        this.getEmail = this.getEmail.bind(this);
        this.getWorkplace = this.getWorkplace.bind(this);
        this.getUIN = this.getUIN.bind(this);
        this.getPassword = this.getPassword.bind(this);
        this.getConfirmPassword = this.getConfirmPassword.bind(this);
    }

    getFullName = (event) => {
        this.setState({
            fullName: event.target.value
        })
    };
    getEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    };
    getWorkplace = (event) => {
        this.setState({
            workplace: event.target.value
        })
    };
    getUIN = (event) => {
        this.setState({
            uin: event.target.value
        })
    };
    getPassword = (event) => {
        this.setState({
            password: event.target.value
        })
    };
    getConfirmPassword = (event) => {
        this.setState({
            confirmPassword: event.target.value
        })
    };


    componentDidMount() {
        sessionStorage.clear()
        localStorage.clear()
        this.form = document.querySelector('#create-account-form');
        this.fullNameInput = document.querySelector('#username');
        this.emailInput = document.querySelector('#email');
        this.uinInput = document.querySelector('#uin');
        this.workplaceInput = document.querySelector('#workplace');
        this.passwordInput = document.querySelector('#password');
        this.confirmPasswordInput = document.querySelector('#confirm-password');
    }

    register() {
        this.validateForm();
        if (this.isFormValid() === true) {
            let user = 'doctor';
            if (this.platform === "Android" || this.platform === "iOS")
                user = 'patient';
            const data = {
                fullName: this.state.fullName,
                role: user.toUpperCase(),
                uin: parseInt(this.state.uin),
                email: this.state.email,
                workplace: this.state.workplace,
                password: this.state.password,
            }
            fetch("http://localhost:8081/users/" + user, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify(data),
            }).then(r => {
                if (r.status === 200) {
                    toast.success("Your account have been registered")
                    window.location.href = ("/login");
                } else if (r.status === 302) {
                    this.setError(this.emailInput, "This email is already taken.");
                } else {
                    this.setError(this.uinInput, "Your UIN is incorrect.");
                }
            });
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

    validateForm() {
        if (this.state.fullName.trim() === '') {
            this.setError(this.fullNameInput, 'Name can not be empty');
        } else if (this.state.fullName.trim().length < 6) {
            this.setError(this.fullNameInput, 'Name must be at least 6 characters');
        } else {
            this.setSuccess(this.fullNameInput);
        }

        if (this.state.email.trim() === '') {
            this.setError(this.emailInput, 'Provide email address');
        } else if (this.state.email.trim() === 'admin@gmail.com')
            this.setError(this.emailInput, 'This email is already taken!')
        else if (this.isEmailValid(this.state.email.trim())) {
            this.setSuccess(this.emailInput);
        } else {
            this.setError(this.emailInput, 'Provide valid email address');
        }
        if (this.platform === "Linux" || this.platform === "macOS" || this.platform === "Windows") {
            if (this.state.uin.trim() === '') {
                this.setError(this.uinInput, 'UIN can not be empty');
            } else if (this.state.uin.trim().length !== 10) {
                this.setError(this.uinInput, 'UIN must be 10-digit number');
            } else {
                this.setSuccess(this.uinInput);
            }

            if (this.state.workplace.trim() === '') {
                this.setError(this.workplaceInput, 'Workspace can not be empty');
            } else if (this.state.workplace.trim().length < 6) {
                this.setError(this.workplaceInput, 'Workspace must be at least 6 characters');
            } else {
                this.setSuccess(this.workplaceInput);
            }
        }

        if (this.state.password.trim() === '') {
            this.setError(this.passwordInput, 'Password can not be empty');
        } else if (this.state.password.trim().length < 6 || this.state.password.trim().length > 16) {
            this.setError(this.passwordInput, 'Password must be 6-16 characters');
        } else {
            this.setSuccess(this.passwordInput);
        }

        if (this.state.confirmPassword.trim() === '') {
            this.setError(this.confirmPasswordInput, 'Password can not be empty');
        } else if (this.state.confirmPassword !== this.state.password) {
            this.setError(this.confirmPasswordInput, 'Password does not match');
        } else {
            this.setSuccess(this.confirmPasswordInput);
        }
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


    isDesktop() {
        if (this.platform === "Linux" || this.platform === "macOS" || this.platform === "Windows") return (
            <>
                <div className="input-group">
                    <label htmlFor="uin">UIN</label>
                    <input type="number" value={this.state.uin} onChange={event => {
                        this.getUIN(event)
                    }} id="uin" placeholder="UIN:" name="uin" />
                    <p>Error Message</p>
                </div>

                <div className="input-group">
                    <label htmlFor="workplace">Workplace</label>
                    <input type="text" value={this.state.workplace} onChange={event => {
                        this.getWorkplace(event)
                    }} id="workplace" placeholder="Workplace:" name="workplace" />
                    <p>Error Message</p>
                </div>
            </>)
        else
            return null;
    }

    render() {
        return (
            <div id="register">
                <form id="create-account-form" className="content">
                    <div className="title">
                        <h2>Create Account</h2>
                    </div>

                    <div className="input-group">
                        <label htmlFor="username">Full Name</label>
                        <input type="text" value={this.state.fullName} onChange={event => {
                            this.getFullName(event)
                        }} id="username" placeholder="Full name:" name="username" />
                        <p>Error Message</p>
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" value={this.state.email} onChange={event => {
                            this.getEmail(event)
                        }} id="email" placeholder="Email:" name="email" />
                        <p>Error Message</p>
                    </div>
                    {this.isDesktop()}
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" value={this.state.password} onChange={event => {
                            this.getPassword(event)
                        }} id="password" placeholder="Password:" name="password" />
                        <p>Error Message</p>
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input type="password" value={this.state.confirmPassword} onChange={event => {
                            this.getConfirmPassword(event)
                        }} id="confirm-password" placeholder="Password:" name="confirmpassword" />
                        <p>Error Message</p>
                    </div>

                    <button type="button" className="btn" onClick={() => this.register()}>Submit</button>

                    <p className="p">Already registered? <a href="/login">Sign In!</a></p>
                </form>
            </div>
        )
    }
}

export default Register;