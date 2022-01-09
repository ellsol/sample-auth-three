import './App.css';
import React, {Component} from 'react'
import Web3 from 'web3'

interface IProps {
}

interface IState {
    account: string;
}

class App extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            account: ''
        };
    }

    componentWillMount() {
        this.loadBlockchainData()
    }

    async loadBlockchainData() {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
        const accounts = await web3.eth.getAccounts()
        this.state = {
            account: accounts[0]
        }
    }


    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>
                        Click 'Connect' to connect to Metamask
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Connect
                    </a>
                    <p>Your account: {this.state.account}</p>
                </header>
            </div>
        );
    }
}

export default App;

