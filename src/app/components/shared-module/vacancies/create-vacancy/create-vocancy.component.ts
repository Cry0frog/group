import { ActiveUrls } from 'src/app/auth/activeUrls';
import { ShortResume } from './../../../../models/resume/shortResume';
import { SessionStorageService } from 'angular-web-storage';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CreateVacancyContentComponent } from './create-vacancy-content/create-vacancy-content.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-vacancy',
  templateUrl: './create-vacancy.component.html',
  styleUrls: ['./create-vacancy.component.css']
})
export class CreateVacancyComponent implements OnInit, OnDestroy {
  @ViewChild(CreateVacancyContentComponent, {static: false}) createVacancyContent: CreateVacancyContentComponent;

  resume: ShortResume;

  constructor(private sessionStorage: SessionStorageService,
    public router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    const savedResume = this.sessionStorage.get('saved_resume');
    if(savedResume != null && savedResume != '') {
      this.resume = ShortResume.convertToObj(JSON.parse(savedResume));

      if(this.resume.fieldActivityIds.length != 0) {
        setTimeout(() => {
          this.createVacancyContent.childFieldsActivity = this.createVacancyContent.childFieldsActivity
            .filter(child => this.resume.fieldActivityIds.find(fieldId => child.id===fieldId));
        }, 200);
      }

    }
  }

  cancleCreateVacancyForPartner() {
    this.resume = null;
    this.createVacancyContent.getAllRootFieldsActivity();
    this.sessionStorage.remove('saved_resume');
  }

  ngOnDestroy() {
    if(!this.router.url.match(ActiveUrls.PARTNER_VACANCY) && this.sessionStorage.get('saved_resume') != null) {
      this.sessionStorage.remove('saved_resume');
    }
  }
}
