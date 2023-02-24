import FixedMenuLayout from '../layout/header';
import { Form, Button, Container, Divider } from 'semantic-ui-react';

function SendHello() {
    return (
        <>
            <FixedMenuLayout />
            <Container>
                <div>
                    <h2>Send Hello Message</h2>
                    <p>Please fill out the following form to send a "Hello" message.</p>
                    <Divider></Divider>
                    <div className="ui two column doubling stackable grid container">
                        <div className="column">
                            <Form className="ui form">
                                <Form.Field className="field">
                                    <label>Your message:</label>
                                    <input placeholder="Hello Message" id="hello" name="hello" />
                                </Form.Field >
                                <Form.Field className="field">
                                    <label>Fee:</label>
                                    <input placeholder='Fee (1 = 10^8 tokens)' type="text" id="fee" name="fee" />
                                </Form.Field>
                                <Form.Field className="field">
                                    <label>Sender's Passphrase:</label>
                                    <input placeholder='Passphrase of the hello_client' id="passphrase" name="passphrase" type="password" />
                                </Form.Field>
                                <Form.Field className="field">
                                    <div className="ui yellow segment">
                                        <i className="lightbulb outline icon"></i>The <strong>Sender's keyPath</strong> value can be from <strong>0-102</strong>. A default value has been pre-filled, which can be changed accordingly.
                                    </div>
                                    <label>Sender's keyPath:</label>
                                    <div className="ui labeled input">
                                        <div className="ui label">
                                            m/44'/134'/
                                        </div>
                                        <input placeholder='Enter any number from 0-102' id="keyPath" name="keyPath" type="text" />
                                        <div className="ui label">
                                            '
                                        </div>
                                    </div>
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

export default SendHello;