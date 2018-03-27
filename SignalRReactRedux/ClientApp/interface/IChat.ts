import { chatActions } from '../actions/ChatActions'
import { IRoomContainer } from './IRoomContainer'
import { IRoom } from './IRoom'

export interface ChatState {
    rooms: IRoomContainer;
    currentRoom: IRoom;
    message: string;
    messageSender: string;
    nickName: string;
    roomNameInput: string;
   
    [key: string]: string | typeof chatActions | IRoomContainer | IRoom;
    actions: typeof chatActions
}

export interface MessageParams {
    user: string,
    roomName: string,
    message?: string
    participants?: Array<string>
}