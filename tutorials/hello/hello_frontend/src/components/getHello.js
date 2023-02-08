import FixedMenuLayout from '../layout/header';
import React, { useState, useEffect } from "react";
import { Divider, Container } from 'semantic-ui-react';
import MessageTimeline from './messageTimeline';
import * as api from '../api';


export default function GetHello() {
    const [messages, getHelloMessages] = useState('');

    useEffect(() => {
        getMessages()
    }, [])

    async function getMessages() {
        const client = await api.getClient();
        return client.invoke("helloInfo_getMessageList", {
        }).then(res => {
            const responseMessages = res
            getHelloMessages(responseMessages);
        });
    }

    return (
        <div>
            <FixedMenuLayout />
            <Container >
                <div>
                    <h2>Hello messages sent so far!</h2>
                    <Divider>
                    </Divider>
                    <MessageTimeline messages={messages} />
                </div>
            </Container>
        </div>
    );
}
