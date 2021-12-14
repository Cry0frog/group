import { PlaceAdvertising } from "./common/placeAdvertising";

export class PublicAdvertising {
  constructor() {
      this.priority = 0;
  }

  id: number;
  advertising: string;
  placeAdvertising: PlaceAdvertising;
  categoryId: number;
  adProvider: string;
  priority: number;
  href: string;
}
