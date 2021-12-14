import { SessionStorageService } from 'angular-web-storage';
import { PartnerService } from './../../../partner/service/partner.service';
import { Vacancy } from 'src/app/models/vacancy/vacancy';
import { CreateVacancyContentComponent } from './../create-vacancy/create-vacancy-content/create-vacancy-content.component';
import { FieldActivity } from 'src/app/models/field-activity/fileldActivity';
import { CommonService } from './../../../../common/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-update-vacancy',
  templateUrl: './update-vacancy.component.html',
  styleUrls: ['./update-vacancy.component.css']
})
export class UpdateVacancyComponent implements OnInit {
  @ViewChild(CreateVacancyContentComponent, {static: false}) createVacancyContent: CreateVacancyContentComponent;

  vacancyId: number;
  fieldsActivity: FieldActivity[];
  vacancy: Vacancy;

  constructor(private location: Location,
    private sessionStorage: SessionStorageService,
    private route: ActivatedRoute,
    private partnerService: PartnerService,
    private commonService: CommonService) {
      this.fieldsActivity = [];
      this.vacancy = new Vacancy();
    }

  ngOnInit() {
    this.vacancyId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.getAllFieldsActivity();
    this.loadVacancyInfo();
  }

  loadVacancyInfo() {
    this.partnerService.getPartnerVacancy(this.vacancyId).subscribe((data: Vacancy) => {
      this.vacancy = data;
    });
  }

  handleUpdateVacancyError(error: any) {
    this.vacancy.isError = true;
    this.vacancy.errors = error.errors;
  }

  back() {
    this.location.back();
  }

  getAllFieldsActivity() {
    this.commonService.getAllRootFieldsActivity().subscribe((data: FieldActivity[]) => {
      this.fieldsActivity = data;
      setTimeout(() => {
        this.createVacancyContent.childFieldsActivity = FieldActivity.sortedArray(data);
        this.createVacancyContent.saveeData(this.vacancy);
      }, 100);
    });
  }

  updateVacancy() {
    this.vacancy = this.createVacancyContent.vacancy;
    this.vacancy.city = this.createVacancyContent.selectedCity;
    this.vacancy.id = this.vacancyId;

    this.vacancy.isError = false;
    this.partnerService.updateVacancy(this.vacancy).subscribe((responce: any) => {
      if(responce == null) {
        return;
      }

      if(responce.ok != null && responce.ok == false) {
        this.handleUpdateVacancyError(responce.error);
        return;
      }

      this.sessionStorage.remove('create_content__saved_vacancy');
      this.back();
    });
  }

}
