import { VacancyComponentMode } from './../../../vacancies/vacancy/vacancyComponentMode';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { ShortResume } from 'src/app/models/resume/shortResume';
import { ShortVacancy } from 'src/app/models/vacancy/shortVacancy';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionStorageService } from 'angular-web-storage';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offering-vacancy-wrapper',
  templateUrl: './offering-vacancy-wrapper.component.html',
  styleUrls: ['./offering-vacancy-wrapper.component.css']
})
export class OfferingVacancyWrapperComponent implements OnInit {
  vacancies: ShortVacancy[];
  isCreateVacancy: boolean;

  constructor(public dialogRef: MatDialogRef<OfferingVacancyWrapperComponent>,
    private sessionStorage: SessionStorageService,
    @Inject(MAT_DIALOG_DATA) public data: ShortResume,
    private partnerService: PartnerService,
    private authService: AuthService,
    public router: Router) { }

  ngOnInit() {
    this.vacancies = [];
    this.getFilteredShortVacancies();
  }

  getFilteredShortVacancies() {
    this.partnerService.getYourAvailableShortVacancies(this.data.id).subscribe((data: ShortVacancy[]) => {
      if(data != null) {
        this.vacancies = ShortVacancy.sortByCreatedAt(data);
        this.isCreateVacancy = this.vacancies.length == 0;
      }
    });
  }

  linkToNewVacancy(): void {
    this.sessionStorage.set('saved_resume', JSON.stringify(this.data));
    this.dialogRef.close();
    window.open(this.router.serializeUrl(this.router.createUrlTree([ActiveUrls.NEW_VACANCY])));
  }

  getVacancyMode() {
    return VacancyComponentMode.COMMON_OFFERING;
  }

  handleChooseVacancy(shortVacancy: ShortVacancy) {
    this.partnerService.offerVacancy(shortVacancy.id, this.data.creatorId).subscribe(_ => {});
    this.dialogRef.close(shortVacancy);
  }
}
