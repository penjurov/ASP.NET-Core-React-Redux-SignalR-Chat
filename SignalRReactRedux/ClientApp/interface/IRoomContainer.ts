import { IRoom } from './IRoom';

export interface IRoomContainer {
    addRoom(room: IRoom): void;
    removeRoom(key: string): void;
    getRoom(name: string): IRoom;
    containsRoom(key: string): Boolean;
    rooms(isPrivate?: Boolean): Array<IRoom>;
}

export class RoomContainer {
    _rooms: Array<IRoom> = new Array<IRoom>();

    getRoom(name: string): IRoom {
        var room = this._rooms.filter(room => {
            return room.name === name;
        });

        if (room.length) {
            return room[0];
        } else {
            throw new Error('Room with that name not found');
        }
    }

    addRoom(room: IRoom) {
        this._rooms.push(room);
    }

    replaceRoom(name: string, replacement: IRoom) {
        var rooms = this._rooms.filter(room => {
            return room.name !== name;
        });

        rooms.push(replacement);
        this._rooms = rooms;
    }

    removeRoom(name: string) {
        var rooms = this._rooms.filter(room => {
            return room.name !== name;
        });

        this._rooms = rooms;
    }

    rooms(isPrivate?: Boolean): IRoom[] {
        let rooms;

        if (isPrivate === null) {
            rooms = this._rooms;
        } else {
            rooms = this._rooms.filter(room => {
                return room.isPrivateRoom === isPrivate;
            })
        }

        return rooms;
    }

    containsRoom(name: string) {
        var room = this._rooms.filter(room => {
            return room.name === name;
        });

        return room.length !== 0;
    }

    toLookup(): IRoomContainer {
        return this;
    }
}