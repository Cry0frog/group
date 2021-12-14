import { SurveyOption } from '../common/surveyOption';

export class SurveyResult {
    constructor(partnerId: number, surveyOption: SurveyOption) {
        this.partnerId = partnerId;
        this.surveyOption = surveyOption;
    }

    partnerId: number;
    surveyOption: SurveyOption
}