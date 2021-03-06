import React from "react";
import { toast } from "react-toastify";
import '../../../css/showBugs.css';
import { Buffer } from "buffer";

class ShowBugs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            a: true
        };
    }

    getBugs() {
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + Buffer.from(localStorage.getItem("email") + ":" + localStorage.getItem("password")).toString('base64'));
        headers.set('Content-Type', 'application/json');
        fetch("http://localhost:8081/bugs", {
            headers: headers
        })
            .then(response => response.json())
            .then(data => {
                if (data.length !== 0) {
                    this.setState({ data: data })

                }
            });
    }

    componentDidMount() {
        this.getBugs()
    }

    setOnClick(event) {
        if (event.target.nextSibling.style.display === 'none')
            event.target.nextSibling.style.display = 'block';
        else
            event.target.nextSibling.style.display = 'none';
    }

    setDelete(id) {
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + Buffer.from(localStorage.getItem("email") + ":" + localStorage.getItem("password")).toString('base64'));
        headers.set('Content-Type', 'application/json');
        fetch("http://localhost:8081/bugs?id=" + id, {
            method: "DELETE",
            headers: headers,   
        }).then(r => {
            if (r.status === 200) {
                toast.success("Bug fixed!");
                this.getBugs()
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
                                    <button className="btn2 green" onClick={() => this.setDelete(element.id)}>Mark
                                        bug as fixed
                                    </button>
                                </div>
                            </div>
                        )
                        : <p>There's no bugs yet!</p>
                }
            </div>)
    }
}

export default ShowBugs;