import * as React from 'react';
import { RoomList } from './RoomList'
import { LeaveRoom } from './LeaveRoom'
import { IRoom } from '../common/IRoom';
import { IParticipant } from '../common/IParticipant';
import { Constants } from '../common/Constants';

interface JoinedUserProps {
    roomNameInput: string;
    updateRoomName: any;
    joinChatClick: any;
    leaveChatClick: Function;
    updateChatState: any;
    changeNickname: any;
    publicRooms: IRoom[];
    privateRooms: IRoom[];
    changeRoom: any;
    chat: string;
    message: string;
    sendMessage: any;
    currentRoomName: string;
    participants: Array<IParticipant>,
    startPrivateChat: any;
}

export const JoinedUserView = (props: JoinedUserProps) => {
    let leaveRoomDiv;

    if (props.currentRoomName !== Constants.GENERAL_ROOM_NAME) {
        leaveRoomDiv = <LeaveRoom currentRoomName={props.currentRoomName} leaveChatClick={props.leaveChatClick}/>
    }

    return (
        <div>
            <div className="input-group top-buffer">
                <input
                    type="text"
                    name="roomName"
                    className="form-control width100"
                    value={props.roomNameInput}
                    onChange={props.updateRoomName} />

                <span className="input-group-btn">
                    <button className="btn btn-info" onClick={props.joinChatClick}>Join</button>
                </span>
            </div>

            <RoomList rooms={props.publicRooms} changeRoom={props.changeRoom} />
            <RoomList rooms={props.privateRooms} changeRoom={props.changeRoom} />

            <div className="row top-buffer">
                <div className="col-sm-10">
                    <textarea className="form-control chat-area" value={props.chat} readOnly={true} />

                    {leaveRoomDiv}

                    <div className="input-group top-buffer">
                        <input
                            type="text"
                            name="message"
                            className="form-control width100"
                            value={props.message}
                            onChange={props.updateChatState} />
                        <span className="input-group-btn">
                            <button className="btn btn-info" onClick={props.sendMessage}>Send</button>
                        </span>
                    </div>
                </div>
                <div className="col-sm-2">
                    <select className="chat-participants" multiple={true}>
                        {props.participants.map((participant, index) => <option key={index} onClick={() => props.startPrivateChat(participant)}>{participant.Nickname}</option>)}
                    </select>

                    <button className="btn btn-info change-nickname" onClick={props.changeNickname}>Change nickname</button>
                </div>
            </div>
        </div>
    );
};