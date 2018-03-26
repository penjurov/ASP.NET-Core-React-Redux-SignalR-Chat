import { chatActions } from '../actions/ChatActions'
import { IRoomContainer, IRoom } from '../common/IRoomContainer'

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
}