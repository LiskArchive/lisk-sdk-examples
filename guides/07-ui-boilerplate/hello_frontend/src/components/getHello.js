import FixedMenuLayout from '../layout/header';
import { Divider, Container } from 'semantic-ui-react';
import MessageTimeline from './messageTimeline';

function GetHello() {
    return (
        <div>
            <FixedMenuLayout />
            <Container >
                <div>
                    <h1>Hello messages sent so far!</h1>
                    <Divider>
                    </Divider>
                    <MessageTimeline messages />
                </div>
            </Container>
        </div>
    );
}

export default GetHello;