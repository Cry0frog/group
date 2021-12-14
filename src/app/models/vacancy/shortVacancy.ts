import { VacancyStatus } from "./vacancyStatus";

export class ShortVacancy {
  id: number;
  name: string;
  status: VacancyStatus;
  salary: number;
  createdAt: Date;
  favorite: boolean;
  dateEndPublication: Date;

  creatorId: number;
  creatorName: string;

  //only ui
  message: string;

  public static convertToObj(obj): ShortVacancy {
    const dto: ShortVacancy = new ShortVacancy();
    Object.assign(dto, obj);
    return dto;
  }

  public static sortByCreatedAt(shortVacancies: ShortVacancy[]): ShortVacancy[] {
    return shortVacancies.sort((a,b) =>
      (a.createdAt < b.createdAt) ? 1
      : (a.createdAt === b.createdAt) ? 0
      : -1
    );
  }

  isHideStatus(): boolean {
    return this.status == VacancyStatus.HIDE;
  }

  isPublishedStatus(): boolean {
    return this.status == VacancyStatus.PUBLISHED;
  }

  isNotPay(): boolean {
    return this.status == VacancyStatus.NOT_PAYED;
  }
}
