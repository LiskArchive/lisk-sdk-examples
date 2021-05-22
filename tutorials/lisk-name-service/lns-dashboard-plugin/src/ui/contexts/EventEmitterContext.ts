import * as React from 'react';
import * as EventEmitter from 'events';

export const NEW_CONFIRMED_TX_EVENT = 'new:confirmed:tx';
export const NEW_BLOCK_EVENT = 'new:block';

const EventEmitterContext = React.createContext<EventEmitter>(new EventEmitter());

export default EventEmitterContext;
