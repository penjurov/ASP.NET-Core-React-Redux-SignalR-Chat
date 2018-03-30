import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { ApplicationState }  from '../store';
import { chatActions } from '../actions/ChatActions';
import { SetNickname } from './SetNickname';
import { JoinedUserView } from './JoinedUserView';
import * as ChatStore from '../common/IChat';
import { Room } from '../common/IRoom';
import { IParticipant, Participant } from '../common/IParticipant';
import { Constants } from '../common/Constants';
import * as toastr from "toastr";

type ChatProps = ChatStore.ChatState & RouteComponentProps<{}>;

class ChatPage extends React.Component<ChatProps, ChatStore.ChatState> {
    constructor(props: any, context: any) {
        super(props, context);

        this.state = props;

        this.updateChatState = this.updateChatState.bind(this);
        this.joinChatClick = this.joinChatClick.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.changeRoom = this.changeRoom.bind(this);
        this.updateRoomName = this.updateRoomName.bind(this);
        this.leaveChatClick = this.leaveChatClick.bind(this);
        this.startPrivateChat = this.startPrivateChat.bind(this);
        this.changeNickname = this.changeNickname.bind(this);
    }

    componentWillReceiveProps(nextProps: ChatProps) {
        if (this.state.currentRoom.chat !== nextProps.currentRoom.chat && this.state.currentRoom.name === nextProps.currentRoom.name) {
            this.setState({
                currentRoom: nextProps.currentRoom
            });
        }

        if (this.state.currentParticipant.Id && this.state.currentParticipant.Id === nextProps.currentParticipant.Id) {
            this.setState({
                currentParticipant: nextProps.currentParticipant
            });
        }

        if ( this.state.rooms.containsRoom(nextProps.currentRoom.name)) {
            var room = this.state.rooms.getRoom(nextProps.currentRoom.name);
            room.hasNewMessages = nextProps.messageSender !== this.state.currentParticipant.Nickname && this.state.currentRoom.name !== nextProps.currentRoom.name;
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

    validateJoinChatClick(state: ChatStore.ChatState): Boolean {
        if (!state.isSetNicknameVisible && !state.roomNameInput) {
            toastr.error('Room name is required');
            return false;
        }

        if ((state.isSetNicknameVisible && !state.nicknameInput)) {
            toastr.error('Nickname is required');
            return false;
        }

        return true;
    }

    joinChatClick() {
        let state: ChatStore.ChatState = Object.assign({}, this.state);

        if (!this.validateJoinChatClick(state)) {
            return;
        }

        let roomName = state.roomNameInput
                    ? Constants.ROOMS_PREFIX + state.roomNameInput
                    : state.currentRoom.name ? state.currentRoom.name : Constants.GENERAL_ROOM_NAME;

        let onSuccess = () => {
            let room = state.rooms.getRoom(roomName);

            if (room) {
                room.hasNewMessages = false;
            } else {
                room = new Room(roomName, '', [state.currentParticipant], false);
            }

            this.setState({
                currentRoom: room,
                roomNameInput: '',
                nicknameInput: '',
                isSetNicknameVisible: false,
                isChangeNickname: false
            });
        }

        this.state.actions.joinRoom({
            participantId: state.currentParticipant.Id,
            nickname: state.isSetNicknameVisible ? state.nicknameInput : state.currentParticipant.Nickname,
            roomName: roomName,
            isPrivateRoom: false,
            onSuccess: onSuccess
        })
    }

    leaveChatClick() {
        let state: ChatStore.ChatState = Object.assign({}, this.state);
        let roomName = state.currentRoom.name;
        
        let onSuccess = () => {
            let room = state.rooms.getRoom(Constants.GENERAL_ROOM_NAME);

            if (room) {
                room.hasNewMessages = false;
            }

            state.rooms.removeRoom(roomName);

            this.setState({
                currentRoom: room,
                roomNameInput: '',
                rooms: state.rooms
            });
        }

        this.state.actions.leaveRoom({
            nickname: state.currentParticipant.Nickname,
            participantId: state.currentParticipant.Id,
            roomName: roomName,
            isPrivateRoom: state.currentRoom.isPrivateRoom,
            onSuccess: onSuccess
        });
    }

    sendMessage() {
        let state: ChatStore.ChatState = Object.assign({}, this.state);
        let message = '<' + this.state.currentParticipant.Nickname + '>: ' + this.state.message;
        
        let onSuccess = () => {
            this.setState({ message: '' });
        }

        this.state.actions.sendMessage({
            roomName: this.state.currentRoom.name,
            message: message,
            nickname: this.state.currentParticipant.Nickname,
            isPrivateRoom: state.currentRoom.isPrivateRoom,
            onSuccess: onSuccess
        });
    }

    changeRoom(roomName: string) {
        let state: ChatStore.ChatState = Object.assign({}, this.state);

        let room = state.rooms.getRoom(roomName);
        room.hasNewMessages = false;
        this.setState({
            currentRoom: room
        });
    }

    startPrivateChat(participant: IParticipant) {
        if (this.state.currentParticipant.Id !== participant.Id) {
            let state: ChatStore.ChatState = Object.assign({}, this.state);
            let roomName = '@' + state.currentParticipant.Nickname + '-' + participant.Nickname ;

            let onSuccess = () => {
                let room = state.rooms.getRoom(roomName);

                if (room) {
                    room.hasNewMessages = false;
                } else {
                    room = new Room(roomName, '', [this.state.currentParticipant], true);
                }

                this.setState({
                    currentRoom: room,
                    roomNameInput: ''
                });
            }

            this.state.actions.startPrivateChat({
                participantId: state.currentParticipant.Id,
                otherParticipantId: participant.Id,
                nickname: state.nicknameInput,
                roomName: roomName,
                isPrivateRoom: true,
                onSuccess: onSuccess
            });
        }
    }

    changeNickname() {
        this.setState({
            isSetNicknameVisible: true,
            isChangeNickname: true
        });
    }

    public render() {
        let body;

        if (this.state.isSetNicknameVisible) {
            body = <SetNickname
                nickname={this.state.nicknameInput}
                joinChatClick={this.joinChatClick}
                isChangeNickname={this.state.isChangeNickname}
                updateChatState={this.updateChatState}
            />
        } else {
            body = <JoinedUserView
                roomNameInput={this.state.roomNameInput}
                updateRoomName={this.updateRoomName}
                joinChatClick={this.joinChatClick}
                updateChatState={this.updateChatState}
                publicRooms={this.state.rooms.rooms(false)}
                privateRooms={this.state.rooms.rooms(true)}
                changeRoom={this.changeRoom}
                chat={this.state.currentRoom.chat}
                message={this.state.message}
                sendMessage={this.sendMessage}
                currentRoomName={this.state.currentRoom.name}
                leaveChatClick={this.leaveChatClick}
                participants={this.state.currentRoom.participants}
                startPrivateChat={this.startPrivateChat}
                changeNickname={this.changeNickname}
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

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);