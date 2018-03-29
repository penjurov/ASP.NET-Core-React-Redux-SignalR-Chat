import { AppThunkAction } from "../store";
import { ChatState, MessageParams, StartPrivateChatParams } from '../interface/IChat';

interface SendMessage { type: 'SEND_MESSAGE', params: MessageParams }
interface JoinRoom { type: 'JOIN_ROOM', params: MessageParams }
interface StartPrivateChat { type: 'START_PRIVATE_CHAT', params: StartPrivateChatParams }

interface SignalRSendMessage { type: 'SIGNALR_SEND_MESSAGE', params: MessageParams }
interface SignalRJoinRoom { type: 'SIGNALR_JOIN_ROOM', params: MessageParams }
interface SignalRLeaveRoom { type: 'SIGNALR_LEAVE_ROOM', params: MessageParams }
interface SignalRStartPrivateChat { type: 'SIGNALR_START_PRIVATE_CHAT', params: MessageParams }


export type KnownAction = SendMessage | JoinRoom | StartPrivateChat | SignalRSendMessage | SignalRJoinRoom | SignalRLeaveRoom | SignalRStartPrivateChat;

export const chatActions = {
    sendMessage: (params: MessageParams): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SIGNALR_SEND_MESSAGE', params });
    },
    joinRoom: (params: MessageParams): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SIGNALR_JOIN_ROOM', params });
    },
    leaveRoom: (params: MessageParams): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SIGNALR_LEAVE_ROOM', params });
    },
    startPrivateChat: (params: StartPrivateChatParams): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SIGNALR_START_PRIVATE_CHAT', params });
    }
};
