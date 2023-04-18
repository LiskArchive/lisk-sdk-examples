import React from 'react'
import {
    Container,
    Dropdown,
    Image,
    Menu,
} from 'semantic-ui-react'
import {
    Link
} from "react-router-dom";
import logo from "../logo.png";

const FixedMenuLayout = () => (

    <div>
        <Menu fixed='top' inverted style={{ backgroundColor: '#0C152E' }}>
            <Container>
                <Menu.Item as={Link} to="/" >
                    <Image src={logo} size='mini' style={{ marginRight: '1.5em', }} />
                    Hello Lisk Application
                </Menu.Item>
                <Dropdown item simple text='Account'>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to="/newAccount" >
                            Create Account
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/getAccountDetails">Account Details</Dropdown.Item>
                        <Dropdown.Item as={Link} to="/transfer">Transfer Tokens</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Dropdown item simple text='Hello Message'>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to="/sendHello">Send Hello Message</Dropdown.Item>
                        <Dropdown.Item as={Link} to="/getHello">Get Hello Messages</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Menu.Item as={Link} to="/faucet">Faucet</Menu.Item>
            </Container>
        </Menu>
        <Container text style={{ marginTop: '7em' }}>
        </Container>
    </div >
)

export default FixedMenuLayout