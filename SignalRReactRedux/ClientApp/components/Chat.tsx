import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { ApplicationState }  from '../store';
import * as ChatStore from '../store/Chat';
import { chatActions } from '../actions/ChatActions';
import { IRoom } from '../common/IRoomContainer';
import { RoomLink } from './RoomLink'

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

    getRegisterUserView() {
        return (
            <div>
                <label htmlFor="nickName">Select Nickname:</label>
                <div className="input-group">
                    <input
                        type="text"
                        name="nickName"
                        className="form-control width100"
                        value={this.state.nickName}
                        onChange={this.updateChatState} />
                    <span className="input-group-btn">
                        <button className="btn btn-info" onClick={this.joinChatClick}>Join</button>
                    </span>
                </div>
            </div>
        );
    }

    getJoinedUserView() {
        return (
            <div>
                <div className="input-group top-buffer">
                    <input
                        type="text"
                        name="roomName"
                        className="form-control width100"
                        value={this.state.roomNameInput}
                        onChange={this.updateRoomName} />

                    <span className="input-group-btn">
                        <button className="btn btn-info" onClick={this.joinChatClick}>Join</button>
                    </span>
                </div>
                <div className='top-buffer'>
                    {this.state.rooms.rooms().map((room: IRoom, index: number) =>
                        <RoomLink key={index} room={room} changeRoom={this.changeRoom} />
                    )}
                </div>
  
                <textarea className="form-control chat-area top-buffer" value={this.state.currentRoom.chat} />

                <div className="input-group top-buffer">
                    <input
                        type="text"
                        name="message"
                        className="form-control width100"
                        value={this.state.message}
                        onChange={this.updateChatState} />
                    <span className="input-group-btn">
                        <button className="btn btn-info" onClick={this.sendMessage}>Send</button>
                    </span>
                </div>
            </div>
        );
    }

    public render() {
        let body;

        if (this.state.currentRoom.name === undefined) {
            body = this.getRegisterUserView();
        } else {
            body = this.getJoinedUserView()
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