import { DevelopmentPartner } from './developmentPartner';

export class PlannedPartnerAction {

  id: number;
  actionTime: Date;
  completed: boolean;
  partnerId: number;
  message: string;

  static convertFromDevPartner(devPartner: DevelopmentPartner): PlannedPartnerAction {
    const partnerAction: PlannedPartnerAction = new PlannedPartnerAction();
    partnerAction.partnerId = devPartner.id;
    partnerAction.actionTime = devPartner.getPreparedTime();
    partnerAction.message = devPartner.message;
    return partnerAction;
  }
}
