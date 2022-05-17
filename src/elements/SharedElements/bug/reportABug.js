import React from "react";
import { toast } from "react-toastify";
import '../../../css/reportABug.css'

class ReportABug extends React.Component {
    form;
    bugTitleInput;
    bugBodyInput;

    constructor(props) {
        super(props);
        this.state = {
            title: "", body: ""
        };
        this.getBugTitle = this.getBugTitle.bind(this);
        this.getBugBody = this.getBugBody.bind(this);
    }

    componentDidMount() {
        this.form = document.querySelector('#create-account-form');
        this.bugTitleInput = document.querySelector('#title');
        this.bugBodyInput = document.querySelector('#bug');
    }


    reportABug() {
        this.validateForm();
        if (this.isFormValid() === true) {
            const data = {
                description: this.state.body,
                title: this.state.title
            }
            let headers = new Headers();
            headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem('email') + ":" + localStorage.getItem('password')));
            headers.set('Content-Type', 'application/json');
            fetch("http://localhost:8081/bugs", {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
            }).then(r => {
                if (r.status === 200) {
                    toast.success("Bug Reported");
                }
                else
                    toast.error("Something unexpected happened! Try again!");

            });
        }
    }

    getBugTitle = (event) => 
        this.setState({
            title: event.target.value
        });

    getBugBody = (event) => 
        this.setState({
            body: event.target.value
        });

    validateForm() {
        if (this.state.title.trim() === '') {
            this.setError(this.bugTitleInput, 'Bug title can not be empty');
        } else if (this.state.title.trim().length < 6) {
            this.setError(this.bugTitleInput, 'Bug title must be at least 6 characters');
        } else {
            this.setSuccess(this.bugTitleInput);
        }

        if (this.state.body.trim() === '') {
            this.setError(this.bugBodyInput, 'Bug body can not be empty');
        } else if (this.state.body.trim().length < 6) {
            this.setError(this.bugBodyInput, 'Bug body must be at least 6 characters');
        } else {
            this.setSuccess(this.bugBodyInput);
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
            <div id="reportABug">
                <form id="create-account-form" className="content">

                    <div className="title">
                        <h2>Report a bug</h2>
                    </div>

                    <div className="input-group">
                        <label htmlFor="title">Bug title</label>
                        <input type="text" value={this.state.title} onChange={event => 
                            this.getBugTitle(event)
                        } id="title" placeholder="Bug title:" name="title" />
                        <p>Error Message</p>
                    </div>

                    <div className="input-group">
                        <label htmlFor="bug">Bug Description</label>
                        <textarea id="bug" value={this.state.body} onChange={event => 
                            this.getBugBody(event)
                        } placeholder="Bug description:" name="bug" />
                        <p>Error Message</p>
                    </div>

                    <button type="button" className="btn" onClick={() => this.reportABug()}>Report</button>
                </form>
            </div>
        )
    }
}

export default ReportABug