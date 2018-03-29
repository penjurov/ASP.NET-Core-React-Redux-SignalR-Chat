import * as React from 'react';
import { IRoom } from '../interface/IRoom';

interface RoomProps {
    room: IRoom;
    changeRoom: Function;
}

export const RoomLink = (props: RoomProps) => {
    let changeRoomOnClick = () => {
        props.changeRoom(props.room.name);
    }

    return (
        <button className={props.room.hasNewMessages ? "btn btn-primary" : "btn btn-default"} onClick={changeRoomOnClick}>{props.room.name}</button>
    );
};