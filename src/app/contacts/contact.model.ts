export class Contact {
  public _id?: string; // MongoDB ObjectId

  constructor(
    public id: string,
    public name: string,
    public email: string,
    public phone: string,
    public imageUrl: string,
    public group: Contact[] | null
  ) {}
}
