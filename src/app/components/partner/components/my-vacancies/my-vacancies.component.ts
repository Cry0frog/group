import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UrlResolver } from '../../common/urlResolver';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { WorkerVacancyWrapperComponent } from './worker-vacancy-wrapper/worker-vacancy-wrapper.component';
import { PartnerVacancyWrapperComponent } from './partner-vacancy-wrapper/partner-vacancy-wrapper.component';
import { UpdateVacancyComponent } from 'src/app/components/shared-module/vacancies/update-vacancy/update-vacancy.component';
import { Resume } from 'src/app/models/resume/resume';

@Component({
  selector: 'app-my-vacancies',
  templateUrl: './my-vacancies.component.html',
  styleUrls: ['./my-vacancies.component.css']
})
export class MyVacancysComponent implements OnInit {

  currentUrl: string;

  activeButton: boolean;

  @Output() currentVacancyid = new EventEmitter<number>();

  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    setTimeout(() => {
      // @ts-ignore
      document.querySelector(`.mode-tasks-area .${this.currentUrl}`).checked = true;
    }, 20)
  }

  onRouterOutletActivate(event) {
    const url = UrlResolver.getMainSectionFromUrl(this.router.url);
    this.currentUrl = url;
    this.route.params.subscribe(param => {
      if(param['id']) {
        this.currentVacancyid.emit(parseInt(param['id']));
      } else {
        this.currentVacancyid.emit(null);
      }
    });
    if(event instanceof PartnerVacancyWrapperComponent
      || event instanceof WorkerVacancyWrapperComponent
      || event instanceof UpdateVacancyComponent){
        this.activeButton = false;
    } else {
      this.activeButton = true;
    }
  }

  switchToPartnerMode() {
    if(this.currentUrl != ActiveUrls.PARTNER_VACANCY) {
      this.router.navigate([`/user/${this.authService.getCurrentId}/${ActiveUrls.PARTNER_VACANCY}`]);
    }
  }

  switchToMyResume() {
    if(this.currentUrl != ActiveUrls.PARTNER_RESUME) {
      this.router.navigate([`/user/${this.authService.getCurrentId}/${ActiveUrls.PARTNER_RESUME}`]);
    }
  }

  switchToMyFavorite() {
    if(this.currentUrl != ActiveUrls.PARTNER_FAVORITE_JOB) {
      this.router.navigate([`/user/${this.authService.getCurrentId}/${ActiveUrls.PARTNER_FAVORITE_JOB}`]);
    }
  }

}
