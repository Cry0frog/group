import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
import { SurveyOption } from 'src/app/models/common/surveyOption';
import { SurveyResult } from 'src/app/models/survey/surveyResult';
import { TRANSLATE_SURVEY_OPTIONS } from '../../../common/surveyOptions.description';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css']
})
export class InterviewComponent implements OnInit {

  translateSurveyOptions = TRANSLATE_SURVEY_OPTIONS;
  value: SurveyOption;

  constructor(private authService: AuthService,
    public dialogRef: MatDialogRef<InterviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

  sendInterview() {
    this.authService.sendSurveyResults(new SurveyResult(this.data.credentials.creatorId, this.value)).subscribe(data => {
      if(data != null) {
        this.onNoClick();
      }
    });
  }

}
