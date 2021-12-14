import { TaskComponentMode } from './../../../../shared-module/tasks/task/taskComponentMode';
import { MainSectionUrls, ActiveUrls } from './../../../../../auth/activeUrls';
import { Router, NavigationEnd } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { FilterChat } from 'src/app/models/chat/filterChat';

export class IActiveCardWithArgs {
  mainUrlSection: string;
  arg: string;

  getNumberArg(): number {
    return parseInt(this.arg);
  }
}

@Component({
  selector: 'app-right-bottom-partner-area',
  templateUrl: './right-bottom-partner-area.component.html',
  styleUrls: ['./right-bottom-partner-area.component.css']
})
export class RighBottomPartnerAreaComponent implements OnInit {
  @Input() isShowVacancyComponent: boolean;

  currentActiveCard: IActiveCardWithArgs;
  taskComponentMode: TaskComponentMode;

  isVacancyComponent: FilterChat;

  constructor(private router: Router) {
    this.parseUrl(this.router.url);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((val: NavigationEnd) => {
      const navigation: NavigationEnd = val;
      this.parseUrl(navigation.url);
      this.determineTaskComponentMode();
    });
  }

  ngOnInit() {
    this.determineTaskComponentMode();
  }

  private parseUrl(url: string) {
    this.currentActiveCard = new IActiveCardWithArgs();

    url.split('/').reverse().some((el: string) => {
      if(MainSectionUrls.includes(el)) {
        this.currentActiveCard.mainUrlSection = el;
        return true;
      }

      this.currentActiveCard.arg = el;
      return false;
    });
  }

  determineTaskComponentMode() {
    if(this.isShowVacancyComponent){
      if(this.currentActiveCard.arg != null && this.currentActiveCard.arg != ActiveUrls.TASK_UPDATE) {
        if(this.currentActiveCard.mainUrlSection == ActiveUrls.PARTNER_VACANCY
          || this.currentActiveCard.mainUrlSection == ActiveUrls.PARTNER_RESUME
          || this.currentActiveCard.mainUrlSection == ActiveUrls.PARTNER_FAVORITE_JOB) {
          this.isVacancyComponent = FilterChat.VACANCY;
          return;
        }
      }
    }else {
      if(this.currentActiveCard.arg != null && this.currentActiveCard.arg != ActiveUrls.TASK_UPDATE) {
        if(this.currentActiveCard.mainUrlSection == ActiveUrls.EXECUTOR_TASKS) {
          this.taskComponentMode = TaskComponentMode.PERFORMER;
          return;
        }
        else if(this.currentActiveCard.mainUrlSection == ActiveUrls.PARTNER_MY_TASKS) {
          this.taskComponentMode = TaskComponentMode.PARTNER;
          return;
        }
      }
    }
    this.taskComponentMode = null;
    this.isVacancyComponent = null;
  }

}
