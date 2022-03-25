import React from "react";
import { toast } from "react-toastify";
import '../../../../css/showBugs.css';

class ShowBugs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }

    componentDidMount() {

        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem("email") + ":" + localStorage.getItem("password")));
        headers.set('Content-Type', 'application/json');
        fetch("http://localhost:8081/bugs", {
            headers: headers
        })
            .then(response => response.json())
            .then(data => {
                if (data.length !== 0)
                    this.setState({ data: data })
            });
    }

    setOnClick(event) {
        if (event.target.nextSibling.style.display === 'none')
            event.target.nextSibling.style.display = 'block';
        else
            event.target.nextSibling.style.display = 'none';
    }

    setDelete(id, event) {
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem('email') + ":" + localStorage.getItem('password')));
        headers.set('Content-Type', 'application/json');
        fetch("http://localhost:8081/bugs", {
            method: "DELETE",
            headers: headers,
            body: JSON.stringify(id)

        }).then(r => {
            if (r.status === 200) {
                toast.success("Bug fixed!");
                event.target.parentElement.parentElement.parentElement.removeChild(event.target.parentElement.parentElement)
            } else
                toast.error("Something unexpected happened! Try again!");
        })
    }


    render() {
        return (
        <div className="content" id="showBugs">
            <h1>Bugs:</h1>
            <hr></hr>
            {
                this.state.data ?
                    this.state.data.map((element) =>
                        <div>
                            <button className="btn" onClick={(event) => this.setOnClick(event)}>{"Bug id:" + element.id}</button>
                            <div style={{ display: 'none' }}>
                                <div className="div">
                                    <h3>{element.title}</h3>
                                    <hr></hr>
                                    <h5>{element.description}</h5>
                                </div>
                                <button className="btn2 green" onClick={(event) => this.setDelete([element.id], event)}>Mark
                                    bug as fixed
                                </button>
                            </div>
                        </div>
                    )
                    : <p>You dont have valid prescriptions yet!</p>
            }
        </div>)
    }
}

export default ShowBugs;