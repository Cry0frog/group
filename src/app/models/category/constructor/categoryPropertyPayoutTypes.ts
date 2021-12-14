
export enum CategoryPropertyPayoutTypes {
  SECURE = "SECURE",
  REGULAR_CARD = "REGULAR_CARD",
  REGULAR_CASH = "REGULAR_CASH",
  REGULAR_NOT_PRINCIPAL = "REGULAR_NOT_PRINCIPAL",
  REGULAR_ACCOUNT="REGULAR_ACCOUNT",

  REGULAR = "REGULAR" //ONLY IN UI
}

export const REGULAR_PAYOUT_TYPES = [
  CategoryPropertyPayoutTypes.REGULAR_CARD,
  CategoryPropertyPayoutTypes.REGULAR_CASH,
  CategoryPropertyPayoutTypes.REGULAR_ACCOUNT,
  CategoryPropertyPayoutTypes.REGULAR_NOT_PRINCIPAL,
];
