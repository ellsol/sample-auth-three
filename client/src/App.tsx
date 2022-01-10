import './App.css';
import React from 'react'
import Web3 from 'web3'
import {clients} from "./api/create_clients";
import {SignMessageResponse} from "./api/models";
import {getEnvironment} from "./api/config";


interface IProps {
}

interface IState {
    account: string;
    token: string;
    user: string;
}

declare let window: any;

let web3: Web3;

// get ip and resource service clients
const api = clients[0];
const ip = clients[1];

class App extends React.Component<IProps, IState> {


    constructor(props: IProps) {
        super(props);

        // check if token exists in local storage to omit METAMASK signature
        ip.clearToken();
        const token = ip.getToken();
        let rawToken = ''
        if (token) {
            rawToken = token.token;
        }

        // prepare state
        this.state = {
            account: '',
            token: rawToken,
            user: ''
        };
    }

    componentDidMount() {
        this.loadBlockchainData()
    }

    async loadBlockchainData() {
        const ethereum = window.ethereum;
        if (!ethereum) {
            alert("please install MetaMask");
            return
        }

        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const accounts = await web3.eth.getAccounts()
        this.setState((previousState, props) => ({
            account: accounts[0]
        }));
    }


    signIn = async () => {
        // check if token exist to not call METAMASK again use stored token
        if (this.state.token !== '') {
            await this.callResourceServiceMeEndpoint()
            return;
        }

        // call ip service to sign with dApp UP
        const m = randomMessage(40);
        await ip.signMessage("0x", m, false)
            .then(r => this.onMessageReturnedFromIPProvider(r))
            .catch(e => {
                console.log(e);
            })
    }

    onMessageReturnedFromIPProvider = async (signedServerMessage: SignMessageResponse) => {
        // call METAMASK to sign message
        const signature = await web3.eth.sign(web3.utils.sha3(signedServerMessage.signature.substring(2)) || "", this.state.account)

        // use signature to authenticate with ip service
        await ip.requestToken(signedServerMessage.message, signedServerMessage.signature.substring(2), signature, "0x", false, [getEnvironment().audience])
            .then(response => {
                this.setState((previousState, props) => ({token: response.token}));
            })
            .then(_ => {
                this.callResourceServiceMeEndpoint()
            })
            .catch(e => {
                console.log(e);
            })
    }

    callResourceServiceMeEndpoint = async () => {
        // call example endpoint me from resource service
        await api.me()
            .then(response => {this.setState((previousState, props) => ({user: JSON.stringify(response, null, 2)}));})
            .catch(e => {console.log(e);})
    }


    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>
                        Click 'Connect' to connect to Metamask
                    </p>
                    <button style={{color: "white", background: "black"}} onClick={this.signIn}>
                        Connect
                    </button>
                    <p>Your account: {this.state.account}</p>
                    <p>Token:</p>
                    <p style={{
                        color: "white",
                        background: "black",
                        margin: "16px",
                        width: "100%"
                    }}>{this.state.token}</p>

                    <p>User (from resource service):</p>
                    <p style={{
                        color: "white",
                        background: "black",
                        margin: "16px",
                        width: "100%"
                    }}>{this.state.user}</p>
                </header>
            </div>
        );
    }
}

function randomMessage(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export default App;

