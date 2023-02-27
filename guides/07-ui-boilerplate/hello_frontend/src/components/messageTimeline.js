import React from "react";
import { Divider } from 'semantic-ui-react';

export default function MessageTimeline(props) {

    const displayMessages = (props) => {
        const { messages } = props;

        if (messages.length > 0) {
            return (
                messages.map((message, index) => {
                    return (
                        <>
                            <div className="message" key={message.ID}>
                                <h4>Hello Message # {message.ID}</h4>
                                <p className="senderAddress"><strong>Sender Address:</strong>  {message.senderAddress}</p>
                                <p className="message"><strong>Message:</strong> {message.message}</p>
                                <p className="blockHeight"><strong>Block Height:</strong> {message.blockHeight}</p>
                            </div> <Divider>
                            </Divider>
                        </>
                    )
                })
            )
        } else {
            return (<h4>No Hello messages have been sent so far!</h4>)
        }
    }
    return (
        <>
            {displayMessages(props)}
        </>
    )
}