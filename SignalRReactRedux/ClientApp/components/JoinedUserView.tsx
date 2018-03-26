import * as React from 'react';
import { RoomLink } from './RoomLink'
import { IRoom } from '../common/IRoomContainer';

interface JoinedUserProps {
    roomNameInput: string;
    updateRoomName: any;
    joinChatClick: any;
    leaveChatClick: any;
    updateChatState: any;
    rooms: IRoom[];
    changeRoom: any;
    chat: string;
    message: string;
    sendMessage: any;
    currentRoomName: string;
}

export const JoinedUserView = (props: JoinedUserProps) => {
    let leaveRoomDiv;

    if (props.currentRoomName !== 'general') {
        leaveRoomDiv = <div className="row top-buffer">
            <div className="col-sm-12">
                <div className="pull-right">
                    <button className="btn btn-danger" onClick={props.leaveChatClick}>Leave #{props.currentRoomName}</button>
                </div>
            </div>
        </div>
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
            <div className='top-buffer'>
                {props.rooms.map((room: IRoom, index: number) =>
                    <RoomLink key={index} room={room} changeRoom={props.changeRoom} />
                )}
            </div>

            <textarea className="form-control chat-area top-buffer" value={props.chat} />

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
    );
};