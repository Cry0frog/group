export class PageableParams {
    constructor() {
      this.page = 0;
      this.size = 15;
      this.countedPages = 0;
    }

    page: number;
    size: number;
    countedPages: number;
}
