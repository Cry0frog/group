import { ShortPartnerPromotion } from './shortPartnerPromotion';

export class ShortPromotion {
  constructor() {
    this.shortPartnerPromotion = [];
    this.amountValue = 0;
  }

  id: number;
  name: string;
  heading: string;
  description: string;
  generateCode: boolean;
  published: boolean;
  amountValue: number;
  showHome: boolean;

  shortPartnerPromotion: ShortPartnerPromotion[];

  public static convertToObj(obj: any): ShortPromotion {
    const shortAdminPromotion = new ShortPromotion();
    Object.assign(shortAdminPromotion, obj);
    return shortAdminPromotion;
  }

  getStatus(): string {
    return this.published ? "Опубликована" : "Не опубликована";
  }
}
