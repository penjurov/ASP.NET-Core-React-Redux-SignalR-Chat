import { Reducer, Action } from 'redux';
import { KnownAction } from '../actions/ChatActions';
import { ChatState } from '../interface/IChat';
import { RoomContainer } from '../interface/IRoomContainer';
import { Room } from '../interface/IRoom';
import { Participant } from '../interface/IParticipant';


export const chatReducer: Reducer<ChatState> = (state: ChatState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    let isNode = typeof window === 'undefined'

    switch (action.type) {
        case 'SEND_MESSAGE': 
            let changed = Object.assign({}, state);
            let chatRoom;

            if (changed.rooms.containsRoom(action.params.roomName)) {
                chatRoom = new Room(changed.rooms[action.params.roomName].name, changed.rooms[action.params.roomName].chat, action.params.participants || []);
                action.params.message = action.params.message || '';
                chatRoom.chat = chatRoom.chat ? chatRoom.chat + "\n" + action.params.message : action.params.message;

                changed.rooms[action.params.roomName] = chatRoom;
            } else {
                chatRoom = new Room(action.params.roomName, action.params.message || '', action.params.participants || []);
                changed.rooms.addRoom(chatRoom);
            }

            let participant;

            if (changed.currentParticipant.Id === action.params.participantId) {
                changed.currentParticipant = new Participant(action.params.nickName, action.params.participantId);
                if (!isNode) {
                    localStorage.setItem('currentChatParticipant', JSON.stringify(changed.currentParticipant));
                }
                
            }

            chatRoom.hasNewMessages = true;
            changed.currentRoom = chatRoom;
            changed.messageSender = action.params.nickName;

            return Object.assign({}, changed);
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