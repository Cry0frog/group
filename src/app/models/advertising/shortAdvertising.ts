import { PlaceAdvertising } from "./common/placeAdvertising";

export class ShortAdvertising {

    constructor() {
        this.priority = 0;
    }

    advertising: string;
    placeAdvertising: PlaceAdvertising;
    categoryId: number;
    href: string;
    priority: number;
}
