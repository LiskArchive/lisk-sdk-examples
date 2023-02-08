import FixedMenuLayout from '../layout/header';
import { Divider, Container } from 'semantic-ui-react';
import MessageTimeline from './messageTimeline';

function GetHello() {
    return (
        <div>
            <FixedMenuLayout />
            <Container >
                <div>
                    <h2>Hello messages sent so far!</h2>
                    <Divider>
                    </Divider>
                    <MessageTimeline messages />
                </div>
            </Container>
        </div>
    );
}

export default GetHello;