import { ShortPromotion } from './shortPromotion';

export class ShortPartnerPromotion {

  constructor() {
    this.friends = [];
    this.promotion = new ShortPromotion();
  }

  id: number;
  partnerId: number;
  generatedCode: string;
  username: string;
  fio: string;
  folder: boolean;
  conditionsMet: boolean;
  friends: ShortPartnerPromotion[];
  confirmPayment: boolean;
  //only ui
  isExpanded: boolean;
  isShow: boolean;

  promotion: ShortPromotion;

  public static convertToObjWithFriends(obj): ShortPartnerPromotion {
      const result: ShortPartnerPromotion = this.convertToObj(obj);
      if(obj.friends != null) {
          result.friends = obj.friends.map(el => this.convertToObj(el));
      }

      if(obj.promotion != null) {
        result.promotion = ShortPromotion.convertToObj(obj.promotion);
      }

      return result;
  }

  public static convertToObj(obj): ShortPartnerPromotion {
      const result: ShortPartnerPromotion = new ShortPartnerPromotion();
      Object.assign(result, obj);
      result.isShow = true;
      result.isExpanded = false;
      return result;
  }

  static getShortPartnersShareInRows(partners: ShortPartnerPromotion[]): ShortPartnerPromotion[] {
      let partnersInRows: ShortPartnerPromotion[] = [];
      let candSort: ShortPartnerPromotion[] = [];
      partners = this.sortedArray(partners);
      partners.forEach((partner: ShortPartnerPromotion) => {
        partner.isShow = true;
        partnersInRows.push(partner);
        if(partner.friends != null && partner.friends.length != 0) {
          partner.friends.forEach((friend: ShortPartnerPromotion) => {
              friend.isShow = false;
              candSort.push(friend);
          });
          partnersInRows = partnersInRows.concat(this.sortedArray(candSort))
          candSort = [];
        }
      });
      const finalCategories: ShortPartnerPromotion[] = partnersInRows;
      return finalCategories;
  }

  static sortedArray(categories: ShortPartnerPromotion[]): ShortPartnerPromotion[] {
    return categories.sort((a, b) => {
       return b.id - a.id;
    });
  }

  isFriend(): boolean {
      return this.folder;
  }
}
