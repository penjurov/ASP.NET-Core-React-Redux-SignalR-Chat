import * as React from 'react';

interface LeaveRoomProps {
    currentRoomName: string;
    leaveChatClick: Function;
}

export const LeaveRoom = (props: LeaveRoomProps) => {
    let leaveChatClick = () => {
        props.leaveChatClick();
    }

    return (
        <div className="row top-buffer">
            <div className="col-sm-12">
                <div className="pull-right">
                    <button className="btn btn-danger" onClick={leaveChatClick}>Leave {props.currentRoomName}</button>
                </div>
            </div>
        </div>
    );
};