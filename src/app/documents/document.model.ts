export class Document {
  public _id?: string; // MongoDB ObjectId

  constructor(
    public id: string,
    public name: string,
    public description: string,
    public url: string,
    public children: Document[] | null
  ) {}
}
