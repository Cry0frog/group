import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Resume } from 'src/app/models/resume/resume';
import { CommonService } from 'src/app/common/services/common.service';
import { FieldActivity } from 'src/app/models/field-activity/fileldActivity';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { SessionStorageService } from 'angular-web-storage';
import { AuthService } from 'src/app/auth/auth.service';
import { ResumeEditorComponent } from '../resume-editor/resume-editor.component';

@Component({
  selector: 'app-common-dialog-resume',
  templateUrl: './common-dialog-resume.component.html',
  styleUrls: ['./common-dialog-resume.component.css']
})
export class CommonDialogResumeComponent implements OnInit {
  @ViewChild(ResumeEditorComponent, {static: true}) resumeEditorComponent: ResumeEditorComponent;

  childFieldsActivity: FieldActivity[];

  constructor(public dialogRef: MatDialogRef<CommonDialogResumeComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public resume: Resume,
    private sessionService: SessionStorageService,
    private commmonService: CommonService,
    private partnerService: PartnerService) {
      this.childFieldsActivity = [];
    }

  ngOnInit() {
    this.getAllChildrenFieldsActivity();
  }

  isNotCreated(): boolean {
    return this.resume.creatorId != null && this.authService.getCurrentId != this.resume.creatorId;
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

  createDefaultResume() {
    this.resume.isError = false;
    this.resume.defaultResume = true;
    this.resume.fieldsActivity = this.childFieldsActivity.
      filter(fieldActivity => this.resumeEditorComponent.toppingChildFieldActivity.value.
      find(fieldActivityId => fieldActivity.id === fieldActivityId));

    this.partnerService.createDefaultResume(this.resume).subscribe(data => {

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

  updateDefaultResume() {
    this.resume.defaultResume = true;
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  markResumeHandler(resume) {
    this.partnerService.markResume(resume).subscribe(data => {
      if(data != null) {
        this.resume = data;
      }
    });
  }
}
