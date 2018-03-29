import { Reducer, Action } from 'redux';
import { KnownAction } from '../actions/ChatActions';
import { ChatState, MessageParams } from '../interface/IChat';
import { RoomContainer } from '../interface/IRoomContainer';
import { Room } from '../interface/IRoom';
import { Participant, IParticipant } from '../interface/IParticipant';

let isParticipantDataChanged = (participant: IParticipant, params: MessageParams) => {
    return participant.Id === params.participantId && participant.NickName !== params.nickName;
}

let updateMessageState = (state: ChatState, params: MessageParams) => {
    let changed = Object.assign({}, state);
    let chatRoom;
    let message = params.message || '';
    let participants = params.participants || [];

    if (changed.rooms.containsRoom(params.roomName)) {
        chatRoom = changed.rooms.getRoom(params.roomName);
        chatRoom.participants = participants;
        chatRoom.chat = chatRoom.chat ? chatRoom.chat + "\n" + message : message;
    } else {
        chatRoom = new Room(params.roomName, message, participants, params.isPrivateRoom);
        changed.rooms.addRoom(chatRoom);
    }

    changed.currentRoom = new Room(chatRoom.name, chatRoom.chat, chatRoom.participants, chatRoom.isPrivateRoom);
    changed.messageSender = params.nickName;

    return changed;
}

export const chatReducer: Reducer<ChatState> = (state: ChatState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    let isNode = typeof window === 'undefined'

    switch (action.type) {
        case 'JOIN_ROOM': {
            let changed = updateMessageState(state, action.params);

            if (!changed.currentParticipant.Id || isParticipantDataChanged(changed.currentParticipant, action.params)) {
                changed.currentParticipant = new Participant(action.params.nickName, action.params.participantId);
                if (!isNode) {
                    localStorage.setItem('currentChatParticipant', JSON.stringify(changed.currentParticipant));
                }
            }

            return Object.assign({}, changed);
        }
        case 'SEND_MESSAGE': {
            let changed = updateMessageState(state, action.params);
            return Object.assign({}, changed);
        }
        case 'START_PRIVATE_CHAT': {
            let changed = updateMessageState(state, action.params);
            return Object.assign({}, changed);
        }
        default:
            var currentParticipant = !isNode && localStorage.getItem('currentChatParticipant') ? JSON.parse(localStorage.getItem('currentChatParticipant') || '') : {};

            return state || {
                rooms: new RoomContainer().toLookup(),
                nickNameInput: '',
                currentRoom: {},
                currentParticipant: currentParticipant,
                roomNameInput: '',
                message: ''
            }
    }
};