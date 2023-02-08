import FixedMenuLayout from '../layout/header';
import { Form, Button, Divider, Container } from 'semantic-ui-react';

function Faucet() {
    return (
        <>
            <FixedMenuLayout />
            <Container>
                <h2>Faucet</h2>
                <p>The faucet transfers tokens from the genesis account to another.</p>
                <Divider></Divider>
                <div>
                    <div class="ui two column doubling stackable grid container">
                        <div class="column">
                            <Form>
                                <Form.Field>
                                    <label>Recipient's Lisk32 Address:</label>
                                    <input placeholder="Recipient's Lisk32 Address" id="address" name="address" />
                                </Form.Field>
                                <Form.Field>
                                    <label>Amount:</label>
                                    <input placeholder='Amount (1 = 10^8 tokens)' id="amount" name="amount" />
                                </Form.Field>
                                <Form.Field class="field">
                                    <label>Sender's private key:</label>
                                    <input placeholder="Private key of sender's account" type="password" id="privateKey" name="privateKey" />
                                </Form.Field>
                                <Button type='submit' fluid size='large' style={{ backgroundColor: '#2BD67B', color: 'white' }}>Submit</Button>
                            </Form>
                        </div>

                        <div className='column'>
                            <h3>Your transaction's details are:</h3>
                            <div class="ui raised segment" style={{ overflow: 'scroll' }}>
                                <>

                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

        </>
    );
}

export default Faucet;