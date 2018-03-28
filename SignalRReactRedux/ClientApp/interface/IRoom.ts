import { IParticipant } from './IParticipant'

export interface IRoom {
    name: string;
    chat: string;
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
    [key: string]: any;

    addParticipant(newParticipant: IParticipant) {
        var exists = this._participants.filter(participant => {
            return participant.NickName === newParticipant.NickName;
        });

        if (!exists.length) {
            this._participants.push(newParticipant);
        }
    }

    removeParticipant(nickName: string) {
        var participants = this._participants.filter(participant => {
            return participant.NickName !== nickName;
        });

        this._participants = participants;
    }

    get participants(): IParticipant[] {
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

    constructor(name: string, chat: string, participants: Array<IParticipant>) {
        this._name = name;
        this._chat = chat;
        this._hasNewMessages = false;
        this._participants = participants || [];
    }

    toLookup(): IRoom {
        return this;
    }
}