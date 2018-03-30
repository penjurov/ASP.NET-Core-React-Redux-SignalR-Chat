import { IParticipant } from './IParticipant'

export interface IRoom {
    name: string;
    chat: string;
    isPrivateRoom: Boolean;
    hasNewMessages: Boolean;
    addParticipant(participant: IParticipant): void;
    removeParticipant(participant: string): void;
    participants: Array<IParticipant>;
    [key: string]: any;
}

export class Room {
    _participants: Array<IParticipant> = new Array<IParticipant>();
    _name: string;
    _chat: string;
    _hasNewMessages: Boolean;
    _isPrivateRoom: Boolean;
    [key: string]: any;

    addParticipant(newParticipant: IParticipant) {
        var exists = this._participants.filter(participant => {
            return participant.Nickname === newParticipant.Nickname;
        });

        if (!exists.length) {
            this._participants.push(newParticipant);
        }
    }

    removeParticipant(nickname: string) {
        var participants = this._participants.filter(participant => {
            return participant.Nickname !== nickname;
        });

        this._participants = participants;
    }

    get participants(): IParticipant[] {
        return this._participants;
    }

    set participants(participants: IParticipant[]) {
        this._participants = participants;
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

    get isPrivateRoom(): Boolean {
        return this._isPrivateRoom;
    }

    constructor(name: string, chat: string, participants: Array<IParticipant>, isPrivateRoom: Boolean) {
        this._name = name;
        this._chat = chat;
        this._hasNewMessages = false;
        this._participants = participants || [];
        this._isPrivateRoom = isPrivateRoom;
    }

    toLookup(): IRoom {
        return this;
    }
}