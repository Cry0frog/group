export class ShortResume {
  constructor() {
    this.fieldActivityIds = [];
  }

  id: number;
  salary: number;
  createdAt: Date;
  lastUpdatedAt: Date;
  vacancyId: number;
  creatorId: number;
  creatorName: string;
  cityName: string;
  desiredPosition;
  fieldActivityIds: number[];

  //only ui
  message: string;

  static convertToObj(obj): ShortResume {
    const shortResume = new ShortResume();
    Object.assign(shortResume, obj);
    return shortResume;
  }

  public static sortByCreatedAt(listShortResume: ShortResume[]): ShortResume[] {
    return listShortResume.sort((a,b) =>
      (a.createdAt < b.createdAt) ? 1
      : (a.createdAt === b.createdAt) ? 0
      : -1
    );
  }
}
