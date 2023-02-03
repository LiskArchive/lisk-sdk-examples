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
                {/* <Image src='../logo.png'></Image> */}
                {/* <img src={logo} alt="Lisk Logo" width="100" /> */}
                {/* <img src="https://reactjs.org/logo-og.png" alt="React Image" /> */}
                {/* <h1>Welcome to the Hello World Application</h1> */}

                <span>

                    <h1><img src={logo} alt="Lisk Logo" width="35" style={{ display: 'inline', verticalAlign: 'middle' }} /> Welcome to the Hello World Application</h1>
                </span>
                <Divider>
                </Divider>
                <h3>The Hello World Application allows you to do the following: </h3>
                <List bulleted style={{ fontSize: 'medium' }}>
                    <List.Item>Account Operations
                        <List.List>
                            <List.Item as={Link} to="/newAccount">Create an Account</List.Item>
                            <List.Item as={Link} to="/getAccountDetails">View Account Details</List.Item>
                            <List.Item as={Link} to="/transfer">Transfer Tokens</List.Item>
                        </List.List>
                    </List.Item>
                    <List.Item>
                        Transactions
                        <List.List>
                            <List.Item as={Link} to="/sendHello">Send Hello Message</List.Item>
                            <List.Item as={Link} to="/getHello">Get Hello Messages</List.Item>
                        </List.List>
                    </List.Item>
                    <List.Item as={Link} to="/faucet">Faucet</List.Item>
                </List>

                {/* <p>
                    By the example of the "Hello World" client, it is explained how to build a very simple sidechain client step by step in the following chapters.
                </p> */}
            </Container>
        </div >
    );
}

export default Home;