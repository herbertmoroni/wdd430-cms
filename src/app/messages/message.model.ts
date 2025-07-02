export class Message {
  public _id?: string; // MongoDB ObjectId

  constructor(
    public id: string,
    public subject: string,
    public msgText: string,
    public sender: string,
    public senderName?: string
  ) {}
}
