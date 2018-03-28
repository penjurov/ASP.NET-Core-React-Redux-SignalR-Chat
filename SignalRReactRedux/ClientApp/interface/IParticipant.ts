export interface IParticipant {
    Id?: string;
    NickName: string;
}

export class Participant {
    Id?: string;
    NickName: string;

    constructor(nickName: string, id?: string) {
        this.Id = id;
        this.NickName = nickName;
    }

    toLookup(): IParticipant {
        return this;
    } 
}