import { IRoom } from './IRoom';

export interface IRoomContainer {
    addRoom(room: IRoom): void;
    removeRoom(key: string): void;
    containsRoom(key: string): Boolean;
    rooms(): Array<IRoom>;
    [key: string]: any;
}

export class RoomContainer {
    _rooms: Array<IRoom> = new Array<IRoom>();
    [key: string]: any;

    addRoom(room: IRoom) {
        this[room.name] = room;
        this._rooms.push(room);
    }

    removeRoom(name: string) {
        var rooms = this._rooms.filter(room => {
            return room.name !== name;
        });

        this._rooms = rooms;
        delete this[name];
    }

    rooms(): IRoom[] {
        return this._rooms;
    }

    containsRoom(name: string) {
        if (typeof this[name] === "undefined") {
            return false;
        }

        return true;
    }

    toLookup(): IRoomContainer {
        return this;
    }
}