export class MsgToLeader {

  subject: string;
  message: string;

  constructor(subject: string, message: string) {
    this.subject = subject;
    this.message = message;
  }
}
