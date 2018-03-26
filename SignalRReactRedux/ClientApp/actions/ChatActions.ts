import { AppThunkAction } from "../store";
import { ChatState, MessageParams } from '../store/Chat';

interface SendMessage { type: 'SEND_MESSAGE', params: MessageParams }
interface JoinRoom { type: 'JOIN_ROOM', params: MessageParams }
interface SignalRSendMessage { type: 'SIGNALR_SEND_MESSAGE', params: MessageParams }
interface SignalRJoinRoom { type: 'SIGNALR_JOIN_ROOM', params: MessageParams }
interface SignalRLeaveRoom { type: 'SIGNALR_LEAVE_ROOM', params: MessageParams }

export type KnownAction = SendMessage | JoinRoom | SignalRSendMessage | SignalRJoinRoom | SignalRLeaveRoom;

export const chatActions = {
    sendMessage: (params: MessageParams): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SIGNALR_SEND_MESSAGE', params });
    },
    joinRoom: (params: MessageParams): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SIGNALR_JOIN_ROOM', params });
    },
    leaveRoom: (params: MessageParams): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SIGNALR_LEAVE_ROOM', params });
    }
};
