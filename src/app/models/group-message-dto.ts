export class GroupMessageDTO {

    subject: string;
    body: string;
    participants: any;

    constructor(subject: string, message: string, participants) {
        this.subject = subject;
        this.body = message;
        this.participants = participants;
    }
}

