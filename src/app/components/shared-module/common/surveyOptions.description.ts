import { SurveyOption } from 'src/app/models/common/surveyOption';

export interface IServeyOptionsMapper {
    value: SurveyOption;
    viewValue: string;
}

export const TRANSLATE_SURVEY_OPTIONS: IServeyOptionsMapper[] = [
  { value: SurveyOption.ADVERTISING_VK, viewValue: 'Реклама в ВК'},
  { value: SurveyOption.FRIENDS_TOLD, viewValue: 'Рассказали друзья'},
  { value: SurveyOption.APPLE_STORE, viewValue: 'Увидел(а) в App Store'},
  { value: SurveyOption.GOOGLE_PLAY, viewValue: 'Увидел(а) в Google Play'},
  { value: SurveyOption.SITE_OR_SEARCH, viewValue: 'Увидел(а) на сайте/в поисковике'},
  { value: SurveyOption.INSTAGRAM, viewValue: 'Увидел(а) в инстаграме'},
  { value: SurveyOption.OTHER, viewValue: 'Другое'}
];

export const TRANSLATE_DISPLAY_SURVEY_OPTIONS = {
  [SurveyOption.ADVERTISING_VK]: "Реклама ВК",
  [SurveyOption.FRIENDS_TOLD]: "Рассказали друзья",
  [SurveyOption.APPLE_STORE]: "Увидел в App Store",
  [SurveyOption.GOOGLE_PLAY]: "Увидел в Google Play",
  [SurveyOption.SITE_OR_SEARCH]: "Увидел(а) на сайте/в поисковике",
  [SurveyOption.INSTAGRAM]: "Увидел(а) в инстаграме",
  [SurveyOption.OTHER]: "Другое",
}
