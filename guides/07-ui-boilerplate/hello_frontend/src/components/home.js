import FixedMenuLayout from '../layout/header';
import { Container, List, Divider } from 'semantic-ui-react';
import {
    Link
} from "react-router-dom";
import logo from "../logo.png";

function Home() {
    return (
        <div>
            <FixedMenuLayout />
            <Container >
                <span>
                    <h1><img src={logo} alt="Lisk Logo" width="35" style={{ display: 'inline', verticalAlign: 'middle' }} /> Welcome to the Hello Lisk application!</h1>
                </span>
                <Divider>
                </Divider>
                <h4>The Hello Lisk application allows you to do the following: </h4>
                <List bulleted style={{ fontSize: 'medium' }}>
                    <List.Item>Account Operations
                        <List.List>
                            <List.Item as={Link} to="/newAccount">Create an Account</List.Item>
                            <List.Item as={Link} to="/getAccountDetails">View Account Details</List.Item>
                            <List.Item as={Link} to="/transfer">Transfer Tokens</List.Item>
                        </List.List>
                    </List.Item>
                    <List.Item>
                        Hello Message
                        <List.List>
                            <List.Item as={Link} to="/sendHello">Send Hello Message</List.Item>
                            <List.Item as={Link} to="/getHello">Get Hello Messages</List.Item>
                        </List.List>
                    </List.Item>
                    <List.Item as={Link} to="/faucet">Faucet</List.Item>
                </List>
            </Container>
        </div >
    );
}

export default Home;