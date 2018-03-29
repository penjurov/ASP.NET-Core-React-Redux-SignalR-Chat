import * as React from 'react';
import { IRoom } from '../interface/IRoom';
import { RoomLink } from './RoomLink'

interface RoomProps {
    rooms: IRoom[];
    changeRoom: Function;
}

export const RoomList = (props: RoomProps) => {
    return (
        <div className='top-buffer'>
            {props.rooms.map((room: IRoom, index: number) =>
                <RoomLink key={index} room={room} changeRoom={props.changeRoom} />
            )}
        </div>
    );
};