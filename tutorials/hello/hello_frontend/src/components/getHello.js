import FixedMenuLayout from '../layout/header';
import React, { useState, useEffect } from "react";
import { Divider, Container } from 'semantic-ui-react';
import MessageTimeline from './messageTimeline';
import { apiClient } from '@liskhq/lisk-client/browser';


export default function GetHello() {

    const RPC_ENDPOINT = 'ws://localhost:7887/rpc-ws';
    const [messages, getHelloMessages] = useState('');

    useEffect(() => {
        getMessages()
    }, [])

    async function getMessages() {
        let clientCache;
        const getClient = async () => {
            if (!clientCache) {
                clientCache = await apiClient.createWSClient(RPC_ENDPOINT);
            }
            return clientCache;
        };
        const client = await getClient();
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
                    <h1>Hello messages sent so far!</h1>
                    <Divider>
                    </Divider>
                    <MessageTimeline messages={messages} />
                </div>
            </Container>
        </div>
    );
}
