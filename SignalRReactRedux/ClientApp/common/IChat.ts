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
    nicknameInput: string;
    isSetNicknameVisible: Boolean;
    isChangeNickname: Boolean;
   
    [key: string]: string | typeof chatActions | IRoomContainer | IRoom | IParticipant | Boolean;
    actions: typeof chatActions
}

export interface MessageParams {
    nickname: string;
    roomName: string;
    message?: string;
    participantId?: string;
    participants?: Array<IParticipant>;
    onSuccess: any;
    isPrivateRoom: Boolean;
    isNickChange?: Boolean;
    oldUserNickName?: string;
}

export interface StartPrivateChatParams extends MessageParams {
    otherParticipantId ?: string;
}