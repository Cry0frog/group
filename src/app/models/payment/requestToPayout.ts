export class RequestToPayout {

  constructor(ids: string[]) {
    this.ids = ids;
  }

  ids: string[];
}