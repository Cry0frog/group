import { Resume } from 'src/app/models/resume/resume';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UrlResolver } from 'src/app/components/partner/common/urlResolver';
import { ShortResume } from 'src/app/models/resume/shortResume';
import { ResumeComponentMode } from '../find-resume-page/resumeComponentMode';
import { VacancyUserAuthorizationComponent } from '../find-resume-page/vacancy-user-authorization/vacancy-user-authorization.component';
import { CommonDialogResumeComponent } from '../common-dialog-resume/common-dialog-resume.component';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { CommonService } from 'src/app/common/services/common.service';

@Component({
  selector: 'app-list-resume',
  templateUrl: './list-resume.component.html',
  styleUrls: ['./list-resume.component.css']
})
export class ListResumeComponent implements OnInit {
  currentUrl: string;

  @Input() listResume: ShortResume[];
  @Input() resumeComponentMode: ResumeComponentMode;
  @Output() eventOfferResume = new EventEmitter<ShortResume>();

  constructor(private authService: AuthService,
    private partnerService: PartnerService,
    private commonService: CommonService,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.currentUrl = UrlResolver.getMainSectionFromUrl(this.router.url);
  }

  isNotYour(resume: ShortResume): boolean {
    return  this.authService.getCurrentId != resume.creatorId;
  }

  offerVacancy(resume) {
    if(this.authService.LoggedUser.authenticated) {
      this.eventOfferResume.emit(resume);
    }
    else {
      this.dialog.open( VacancyUserAuthorizationComponent, {
        width: '550px',
        data: resume
      });
    }
  }

  isAdmin(): boolean {
    return this.authService.LoggedUser.authenticated && this.authService.isAdmin();
  }

  isCommonMode(): boolean {
    return this.resumeComponentMode == ResumeComponentMode.COMMON;
  }

  isCommonOfferingMode(): boolean {
    return this.resumeComponentMode == ResumeComponentMode.COMMON_OFFERING;
  }

  isUserMode(): boolean {
    return this.resumeComponentMode == ResumeComponentMode.USER;
  }

  openMyResume(resume: ShortResume) {
    this.commonService.getResumeById(resume.id).subscribe(data => {
      this.openDialogResume(data);
    });
  }

  openDialogResume(resume: Resume) {
    this.dialog.open(CommonDialogResumeComponent, {
      width: '950px',
      autoFocus: false,
      data: resume,
      panelClass: 'profile_resume_window'

    });
  }

  isFavoriteResumeComponrntMode(): boolean {
    return this.resumeComponentMode == ResumeComponentMode.FAVORITE;
  }
}
