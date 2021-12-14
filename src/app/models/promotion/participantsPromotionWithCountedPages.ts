import { LazyLoadingModel } from './../lazyLoading/lazyLoadingModel';
import { ShortPartnerPromotion } from './shortPartnerPromotion';

export class ParticipantsPromotionWithCountedPages extends LazyLoadingModel{

  constructor() {
    super();
    this.participants = [];
  }

  participants: ShortPartnerPromotion[];

  public static convertToObj(obj): ParticipantsPromotionWithCountedPages {
    if(obj == null) {
      return null;
    }

    const participantsWithCountedPages = new ParticipantsPromotionWithCountedPages();
    Object.assign(participantsWithCountedPages, obj);
    participantsWithCountedPages.participants = obj.participants.map(obj => ShortPartnerPromotion.convertToObjWithFriends(obj));

    return participantsWithCountedPages;
  }
}
