export interface IRoomContainer {
    add(key: string, value: any): void;
    remove(key: string): void;
    containsRoom(key: string): Boolean;
    rooms(): Array<IRoom>;
    [key: string]: any;
}

export interface IRoom {
    name: string,
    chat: string,
    hasNewMessages: Boolean,
    [key: string]: any;
}


export class RoomContainer {

    _rooms: Array<IRoom> = new Array<IRoom>();
    [key: string]: any;

    add(name: string, chat: string) {
        let room: IRoom = {
            name: name,
            chat: chat,
            hasNewMessages: false
        };

        this[name] = room;
        this._rooms.push(room);
    }

    remove(name: string) {
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