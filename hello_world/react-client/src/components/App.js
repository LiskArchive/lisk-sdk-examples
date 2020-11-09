import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import "regenerator-runtime/runtime.js";
import Home from './home';
import NewAccount from './NewAccount';
import Faucet from './Faucet';
import SendHello from './Hello';
import Account from './Account';
import Transfer from './Transer';

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
                        <li><Link to="/send-hello">Send Hello</Link></li>
                        <li><Link to="/send-transfer">Send Transfer</Link></li>
                        <hr />
                        <h3> Explore </h3>
                        <li><Link to="/account">Account</Link></li>
                    </ul>
                </Route>

                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/send-hello">
                        <SendHello />
                    </Route>
                    <Route path="/new-account">
                        <NewAccount />
                    </Route>
                    <Route path="/faucet">
                        <Faucet />
                    </Route>
                    <Route path="/send-transfer">
                        <Transfer />
                    </Route>
                    <Route path="/account">
                        <Account />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
