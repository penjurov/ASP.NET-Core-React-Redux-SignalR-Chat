import { Reducer, Action } from 'redux';
import { KnownAction } from '../actions/ChatActions';
import { ChatState } from '../interface/IChat';
import { RoomContainer } from '../interface/IRoomContainer';
import { Room } from '../interface/IRoom'

export const chatReducer: Reducer<ChatState> = (state: ChatState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
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