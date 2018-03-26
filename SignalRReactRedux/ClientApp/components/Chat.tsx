import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { ApplicationState }  from '../store';
import * as ChatStore from '../store/Chat';
import { chatActions } from '../actions/ChatActions';
import { RegisterUserView } from './RegisterUserView'
import { JoinedUserView } from './JoinedUserView'

type ChatProps = ChatStore.ChatState & RouteComponentProps<{}>;

class Chat extends React.Component<ChatProps, ChatStore.ChatState> {
    constructor(props: any, context: any) {
        super(props, context);

        this.state = props;

        this.updateChatState = this.updateChatState.bind(this);
        this.joinChatClick = this.joinChatClick.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.changeRoom = this.changeRoom.bind(this);
        this.updateRoomName = this.updateRoomName.bind(this);
        this.leaveChatClick = this.leaveChatClick.bind(this);
    }

    componentWillReceiveProps(nextProps: ChatProps) {
        if (this.state.currentRoom.chat != nextProps.currentRoom.chat && this.state.currentRoom.name === nextProps.currentRoom.name) {
            this.setState({
                currentRoom: nextProps.currentRoom
            });
        }

        if (this.state.rooms.containsRoom(nextProps.currentRoom.name)) {
            var room = this.state.rooms[nextProps.currentRoom.name];
            room.hasNewMessages = nextProps.messageSender !== this.state.nickName && this.state.currentRoom.name !== nextProps.currentRoom.name;
        }
    }

    updateChatState(event: any) {
        let state: ChatStore.ChatState = Object.assign({}, this.state);

        let field = event.target.name;
        let value = event.target.value;

        state[field] = value;

        this.setState(state);
    }

    updateRoomName(event: any) {
        let state: ChatStore.ChatState = Object.assign({}, this.state);

        state.roomName = event.target.value;
        state.roomNameInput = event.target.value;

        this.setState(state);
    }

    joinChatClick() {
        let state: ChatStore.ChatState = Object.assign({}, this.state);

        let roomName = this.state.roomNameInput || 'general';
        let room = state.rooms[roomName];

        if (room) {
            room.hasNewMessages = false;
        } else {
            room = {
                name: roomName
            };
        }
       
        this.setState({
            currentRoom: room,
            roomNameInput: ''
        });

        this.state.actions.joinRoom({
            user: this.state.nickName,
            roomName: roomName
        });
    }

    leaveChatClick() {
        let state: ChatStore.ChatState = Object.assign({}, this.state);

        let roomName = state.currentRoom.name
        let room = state.rooms['general'];

        if (room) {
            room.hasNewMessages = false;
        }

        state.rooms.remove(state.currentRoom.name);

        this.setState({
            currentRoom: room,
            roomNameInput: '',
            rooms: state.rooms
        });

        this.state.actions.leaveRoom({
            user: this.state.nickName,
            roomName: roomName
        });
    }

    sendMessage() {
        let message = '<' + this.state.nickName + '>: ' + this.state.message;
        this.setState({ message: '' });
        this.state.actions.sendMessage({
            roomName: this.state.currentRoom.name,
            message: message,
            user: this.state.nickName
        });
    }

    changeRoom(roomName: string) {
        let state: ChatStore.ChatState = Object.assign({}, this.state);

        let room = state.rooms[roomName];
        room.hasNewMessages = false;
        this.setState({
            currentRoom: room
        });
    }

    public render() {
        let body;

        if (this.state.currentRoom.name === undefined) {
            body = <RegisterUserView
                nickName={this.state.nickName}
                joinChatClick={this.joinChatClick}
                updateChatState={this.updateChatState}
            />
        } else {
            body = <JoinedUserView
                roomNameInput={this.state.roomNameInput}
                updateRoomName={this.updateRoomName}
                joinChatClick={this.joinChatClick}
                updateChatState={this.updateChatState}
                rooms={this.state.rooms.rooms()}
                changeRoom={this.changeRoom}
                chat={this.state.currentRoom.chat}
                message={this.state.message}
                sendMessage={this.sendMessage}
                currentRoomName={this.state.currentRoom.name}
                leaveChatClick={this.leaveChatClick}
            />
        }

        return <div className="top-buffer">
            {body}
        </div>;
    }
}

function mapStateToProps(state: ApplicationState, ownProps: any) {
    return Object.assign({}, state.chat);
}

function mapDispatchToProps(dispatch: any) {
    return { actions: bindActionCreators(chatActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);