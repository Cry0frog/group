import { ActiveUrls } from 'src/app/auth/activeUrls';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UrlResolver } from 'src/app/components/partner/common/urlResolver';

@Component({
  selector: 'app-chats-area',
  templateUrl: './chats-area.component.html',
  styleUrls: ['./chats-area.component.css']
})
export class ChatsAreaComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    const url = UrlResolver.getMainSectionFromUrl(this.router.url);
    // @ts-ignore
    document.querySelectorAll(`.partner-panel .${url}`)[0].checked = true;
  }

  getMyArbitrationRouterLink() {
    return ActiveUrls.ADMIN_MY_ARBITRATIONS;
  }

  getAllArbitrationRouterLink() {
    return ActiveUrls.ADMIN_ALL_ARBITRATIONS;
  }

  getTaskChatsRouterLink() {
    return ActiveUrls.ADMIN_TASK_CHATS;
  }

  getVacancyChatsRouterLink() {
    return ActiveUrls.ADMIN_VACANCY_CHATS;
  }

  getMyChatsRouterLink() {
    return ActiveUrls.ADMIN_MY_CHATS;
  }

}
