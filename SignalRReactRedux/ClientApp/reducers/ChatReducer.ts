﻿import { Reducer, Action } from 'redux';
import { KnownAction } from '../actions/ChatActions';
import { ChatState, MessageParams } from '../common/IChat';
import { RoomContainer } from '../common/IRoomContainer';
import { Room } from '../common/IRoom';
import { Participant, IParticipant } from '../common/IParticipant';

let isParticipantDataChanged = (participant: IParticipant, params: MessageParams) => {
    return participant.Id && participant.Id === params.participantId && participant.Nickname !== params.nickname;
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
    changed.messageSender = params.nickname;

    return changed;
}

export const chatReducer: Reducer<ChatState> = (state: ChatState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    let isNode = typeof window === 'undefined'

    switch (action.type) {
        case 'JOIN_ROOM': {
            let changed = updateMessageState(state, action.params);

            let participantDataChanged = isParticipantDataChanged(changed.currentParticipant, action.params);

            if (!changed.currentParticipant.Id || participantDataChanged) {
                changed.currentParticipant = new Participant(action.params.nickname, action.params.participantId);
                if (!isNode) {
                    localStorage.setItem('currentChatParticipant', JSON.stringify(changed.currentParticipant));
                }
            }

            if (action.params.isNickChange) {
                let message = action.params.message || '';

                changed.rooms.rooms()
                    .filter(room => {
                        return room.name !== changed.currentRoom.name;
                    })
                    .forEach(room => {
                        room.removeParticipant(action.params.oldUserNickName || '');
                        var participant = new Participant(action.params.nickname, action.params.participantId);
                        room.addParticipant(participant);
                        room.chat = room.chat ? room.chat + "\n" + message : message;
                    });
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
                nicknameInput: '',
                currentRoom: {
                    participants: []
                },
                currentParticipant: currentParticipant,
                roomNameInput: '',
                message: '',
                isSetNicknameVisible: true,
                isChangeNickname: false
            }
    }
};