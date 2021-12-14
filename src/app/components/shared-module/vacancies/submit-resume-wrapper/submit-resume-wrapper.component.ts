import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionStorageService } from 'angular-web-storage';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService } from 'src/app/common/services/common.service';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { FieldActivity } from 'src/app/models/field-activity/fileldActivity';
import { Resume } from 'src/app/models/resume/resume';
import { ResumeEditorComponent } from '../../resume/resume-editor/resume-editor.component';

@Component({
  selector: 'app-submit-resume-wrapper',
  templateUrl: './submit-resume-wrapper.component.html',
  styleUrls: ['./submit-resume-wrapper.component.css']
})
export class SubmitResumeWrapperComponent implements OnInit {
  @ViewChild(ResumeEditorComponent, {static: true}) resumeEditorComponent: ResumeEditorComponent;
  vacancyId: number;
  childFieldsActivity: FieldActivity[];

  constructor(public dialogRef: MatDialogRef<SubmitResumeWrapperComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public resume: Resume,
    private sessionService: SessionStorageService,
    private commmonService: CommonService,
    private partnerService: PartnerService) {
      this.childFieldsActivity = [];
      this.vacancyId = this.resume.vacancyId;
    }

  ngOnInit() {
    if(this.resume.id == null) {
      this.getMyDefaultResume();
    }

    this.getAllChildrenFieldsActivity();
  }

  getAllChildrenFieldsActivity() {
    this.commmonService.getAllRootFieldsActivity().subscribe(data => {
      if(data != null) {
        this.childFieldsActivity = FieldActivity.sortedArray(data);
        this.resumeEditorComponent.toppingChildFieldActivity.setValue(this.resume.fieldsActivity.map(fieldActivity => fieldActivity.id));
      }
    })
  }

  handleResumeCreationError(error: any) {
    this.resume.isError = true;
    this.resume.errors = error.errors;
  }

  getMyDefaultResume() {
    this.partnerService.getMyDefaultResume().subscribe((data: Resume) => {
      if(data != null) {
        this.resume = data;
        this.resume.vacancyId = this.vacancyId;
        this.resume.id = null;

        let order = 0;
        this.resume.properties.forEach(prop => {
          prop.id = null;
          prop.order = order;
          ++order;
        });
        this.resume.defaultResume = false;
        this.resumeEditorComponent.getCity();
      }
    });
  }

  createResume() {
    this.resume.isError = false;
    this.resume.fieldsActivity = this.childFieldsActivity.
      filter(fieldActivity => this.resumeEditorComponent.toppingChildFieldActivity.value.
      find(fieldActivityId => fieldActivity.id === fieldActivityId));

    this.partnerService.createResume(this.resume).subscribe(data => {

      if(data.ok != null && data.ok == false) {
        this.handleResumeCreationError(data.error);
        return;
      }

      this.sessionService.remove('create_content__saved_resume');

      if(data.errors == undefined) {
        this.dialogRef.close(data);
        return;
      }
    });
  }

  updateResume() {
    this.resume.isError = false;
    this.resume.fieldsActivity = this.childFieldsActivity.
      filter(fieldActivity => this.resumeEditorComponent.toppingChildFieldActivity.value.
      find(fieldActivityId => fieldActivity.id === fieldActivityId));

    this.partnerService.updateDefaultResume(this.resume).subscribe((responce: any) => {
      if(responce == null) {
        return;
      }

      if(responce.ok != null && responce.ok == false) {
        this.handleResumeCreationError(responce.error);
        return;
      }

      this.sessionService.remove('create_content__saved_resume');

      if(responce.errors == undefined) {
        this.dialogRef.close(responce);
        return;
      }
    });
  }

  isNotCreated(): boolean {
    return this.resume.creatorId != null && this.authService.getCurrentId != this.resume.creatorId;
  }

  markResumeHandler(resume) {
    this.partnerService.markResume(resume).subscribe(data => {
      if(data != null) {
        this.resume = data;
      }
    });
  }

}
