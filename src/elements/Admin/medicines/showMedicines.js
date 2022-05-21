import React from "react";
import { toast } from "react-toastify";
import '../../../css/showMedicines.css';
import { Buffer } from "buffer";

class ShowMedicines extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            ip: 'http://localhost:8081/medicines?name=',
            pathname: ""
        };
    }

    async getMedicines() {
        const url = new URL(window.location.href);
        this.setState({ pathname: url.pathname });
        if (url.pathname === '/showMachineMedicines') {
            const newIP = sessionStorage.getItem('machineIP') + '/medicines?prescription=both';
            await this.setState({ ip: newIP });

        }
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + Buffer.from(localStorage.getItem("email") + ":" + localStorage.getItem("password")).toString('base64'));
        headers.set('Content-Type', 'application/json');
        fetch(this.state.ip, {
            headers: headers
        })
            .then(response => response.json())
            .then(data => {
                if (data.length !== 0)
                    this.setState({ data: data });
            });
    }

    async componentDidMount() {
        this.getMedicines();
    }

    async setDelete(name) {
        const url = new URL(window.location.href);
        if (url.pathname === '/showMachineMedicines') {
            await this.setState({ ip: sessionStorage.getItem('machineIP') + '/medicines?name=' + name });
        }
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + Buffer.from(localStorage.getItem("email") + ":" + localStorage.getItem("password")).toString('base64'));
        headers.set('Content-Type', 'application/json');
        fetch(this.state.ip + name, {
            method: "DELETE",
            headers: headers
        }).then(r => {
            if (r.status === 200) {
                toast.success("Medicine " + name + " deleted!");
                this.getMedicines()
            } else
                toast.error("Something unexpected happened! Try again!");
        }).then(() => {
            if (url.pathname === '/showMachineMedicines') {
                fetch(sessionStorage.getItem('machineIP') + "/configuration/router/mapping", {
                    method: "GET",
                    headers: headers,
                })
                    .then(response => response.json())
                    .then(data => {
                        data.forEach(element => {
                            if (element.medicineName === name[0]) {
                                data = data.filter(el => el !== element)
                                fetch(sessionStorage.getItem("machineIP") + "/configuration/router/mapping", {
                                    method: "POST",
                                    headers: headers,
                                    body: JSON.stringify(data)
                                }).then(resp => {
                                    if (resp.status === 200) {
                                        toast.success("SlotID is now free to use!")
                                    } else {
                                        toast.error("Something unexpexted happened! Try again.")
                                    }
                                })
                            }
                        });

                    })
            }
        })
    }

    render() {
        return (
            <div className="content" id="showMedicines">
                <h1>Medicines</h1>
                <hr />
                {
                    this.state.data ?
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>name</th>
                                        {this.state.pathname === '/showMachineMedicines' ?
                                            <>
                                                <th>price</th>
                                                <th>amount</th>
                                            </>
                                            :
                                            <></>
                                        }

                                        <th>needs prescription</th>
                                        <th>delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.data.map((medicine) =>
                                        <tr>
                                            <td>{medicine.name}</td>
                                            {this.state.pathname === '/showMachineMedicines' ?
                                                <>
                                                    <td>{medicine.price}</td>
                                                    <td>{medicine.amount}</td>
                                                </>
                                                :
                                                <></>
                                            }

                                            <td>{medicine.needsPrescription ? "needs prescription" : "doesn't need prescription"}</td>
                                            <td>
                                                <button className="rmvBtn"
                                                    onClick={() => this.setDelete(medicine.name)}>Delete
                                                    Medicine
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                        </div>
                        : <p>There is no medicines yet!</p>
                }
            </div>)
    }
}

export default ShowMedicines;