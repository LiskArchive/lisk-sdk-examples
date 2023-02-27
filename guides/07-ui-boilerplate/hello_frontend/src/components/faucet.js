import FixedMenuLayout from '../layout/header';
import { Form, Button, Divider, Container } from 'semantic-ui-react';

function Faucet() {
    return (
        <>
            <FixedMenuLayout />
            <Container>
                <h2>Faucet</h2>
                <p>The faucet transfers tokens from the genesis account to another account.</p>
                <Divider></Divider>
                <div>
                    <div className="ui two column doubling stackable grid container">
                        <div className="column">
                            <Form>
                                <Form.Field>
                                    <label>Recipient's Lisk32 Address:</label>
                                    <input placeholder="Recipient's Lisk32 Address" id="address" name="address" />
                                </Form.Field>
                                <Button type='submit' fluid size='large' style={{ backgroundColor: '#2BD67B', color: 'white' }}>Submit</Button>
                            </Form>
                        </div>

                        <div className='column'>
                            <>
                            </>
                        </div>
                    </div>
                </div>
            </Container>

        </>
    );
}

export default Faucet;