import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import "regenerator-runtime/runtime.js";
import NewAccount from './NewAccount';
import Accounts from './Accounts';
import HelloAccounts from './HelloAccounts';
import Faucet from './Faucet';
import SendTransfer from './Transfer';
import SendHello from './Hello';
import Transactions from './Transactions';
import HelloTransactions from './HelloTransactions';
import Blocks from './Blocks';
import Home from './home';

// The pages of this site are rendered dynamically
// in the browser (not server rendered).

export default function App() {
    return (
        <Router>
            <div>
                <Route>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <hr />
                        <h3> Interact </h3>
                        <li><Link to="/new-account">New Account</Link></li>
                        <li><Link to="/faucet">Faucet</Link></li>
                        <li><Link to="/send-transfer">Send tokens</Link></li>
                        <li><Link to="/send-hello">Send Hello</Link></li>
                        <hr />
                        <h3> Explore </h3>
                        <li><Link to="/accounts">Accounts</Link></li>
                        <li><Link to="/hello-accounts">Hello accounts</Link></li>
                        <li><Link to="/transactions">Transactions</Link></li>
                        <li><Link to="/hello-transactions">Hello transactions</Link></li>
                        <li><Link to="/blocks">Blocks</Link></li>
                    </ul>
                </Route>

                {/*
                  A <Switch> looks through all its children <Route>
                  elements and renders the first one whose path
                  matches the current URL. Use a <Switch> any time
                  you have multiple routes, but you want only one
                  of them to render at a time
                */}
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/new-account">
                        <NewAccount />
                    </Route>
                    <Route path="/faucet">
                        <Faucet />
                    </Route>
                    <Route path="/send-transfer">
                        <SendTransfer />
                    </Route>
                    <Route path="/send-hello">
                        <SendHello />
                    </Route>
                    <Route path="/accounts">
                        <Accounts />
                    </Route>
                    <Route path="/hello-accounts">
                        <HelloAccounts />
                    </Route>
                    <Route path="/blocks">
                        <Blocks />
                    </Route>
                    <Route path="/transactions">
                        <Transactions />
                    </Route>
                    <Route path="/hello-transactions">
                        <HelloTransactions />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
