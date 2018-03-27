export interface IRoom {
    name: string;
    chat: string;
    hasNewMessages: Boolean;
    addParticipant(name: string): void;
    removeParticipant(name: string): void;
    participants: Array<string>;
    [key: string]: any;
}

export class Room {
    _participants: Array<string> = new Array<string>();
    _name: string;
    _chat: string;
    _hasNewMessages: Boolean;
    [key: string]: any;

    addParticipant(name: string) {
        var exists = this._participants.filter(participant => {
            return participant === name;
        });

        if (!exists.length) {
            this._participants.push(name);
        }
    }

    removeParticipant(name: string) {
        var participants = this._participants.filter(participant => {
            return participant !== name;
        });

        this._participants = participants;
    }

    get participants(): string[] {
        return this._participants;
    }

    get name(): string {
        return this._name;
    }

    get chat(): string {
        return this._chat;
    }

    set chat(chat: string) {
        this._chat = chat;
    }

    get hasNewMessages(): Boolean {
        return this._hasNewMessages;
    }

    set hasNewMessages(hasNewMessages: Boolean) {
        this._hasNewMessages = hasNewMessages;
    }

    constructor(name: string, chat: string, participants: Array<string>) {
        this._name = name;
        this._chat = chat;
        this._hasNewMessages = false;
        this._participants = participants || [];
    }

    toLookup(): IRoom {
        return this;
    }
}