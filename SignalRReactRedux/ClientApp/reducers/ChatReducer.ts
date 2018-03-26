import { Reducer, Action } from 'redux';
import { ChatState } from '../store/Chat';
import { KnownAction } from '../actions/ChatActions';
import { RoomContainer, IRoom } from '../common/IRoomContainer';

export const chatReducer: Reducer<ChatState> = (state: ChatState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'SEND_MESSAGE': 
            let changed = Object.assign({}, state);
            let chatRoom;

            if (changed.rooms.containsRoom(action.params.roomName)) {
                chatRoom = Object.assign({}, changed.rooms[action.params.roomName]);
                action.params.message = action.params.message || '';
                chatRoom.chat = chatRoom.chat ? chatRoom.chat + "\n" + action.params.message : action.params.message;
                changed.rooms[action.params.roomName].chat = chatRoom.chat;
            } else {
                changed.rooms.add(action.params.roomName, action.params.message);
                chatRoom = changed.rooms[action.params.roomName];
            }

            chatRoom.hasNewMessages = true;
            changed.currentRoom = chatRoom;
            changed.messageSender = action.params.user;

            return Object.assign({}, changed);
        default:
            return state || {
                rooms: new RoomContainer().toLookup(),
                nickName: '',
                currentRoom: {},
                roomNameInput: '',
                message: ''
            }
    }
};