import { chatActions } from '../actions/ChatActions'
import { IRoomContainer } from './IRoomContainer'
import { IRoom } from './IRoom'
import { IParticipant } from './IParticipant'

export interface ChatState {
    rooms: IRoomContainer;
    currentRoom: IRoom;
    message: string;
    messageSender: string;
    currentParticipant: IParticipant;
    roomNameInput: string;
    nickNameInput: string;
   
    [key: string]: string | typeof chatActions | IRoomContainer | IRoom | IParticipant;
    actions: typeof chatActions
}

export interface MessageParams {
    nickName: string;
    roomName: string;
    message?: string;
    participantId?: string;
    participants?: Array<IParticipant>;
    onSuccess: any;
}