export class ShortNews {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  dateCreated: Date;
  published: boolean;

  public static convertToObj(obj): ShortNews {
    const shortNews = new ShortNews();
    Object.assign(shortNews, obj);
    return shortNews;
  }

  getStatus(): string {
    return this.published ? "Опубликована" : "Не опубликована";
  }

  static sortByDate(listNews): ShortNews[] {
    return listNews.sort((a,b) => b.dateCreated - a.dateCreated);
  }
}
