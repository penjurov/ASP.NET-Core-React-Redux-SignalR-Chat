export interface IParticipant {
    Id?: string;
    Nickname: string;
}

export class Participant {
    Id?: string;
    Nickname: string;

    constructor(nickname: string, id?: string) {
        this.Id = id;
        this.Nickname = nickname;
    }

    toLookup(): IParticipant {
        return this;
    } 
}