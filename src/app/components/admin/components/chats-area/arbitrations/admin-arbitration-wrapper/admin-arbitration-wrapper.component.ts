import { AdminChatService } from './../../../../service/admin-chat.service';
import { ChatWrapperComponent } from './../../../../../shared-module/chat/chat-wrapper/chat-wrapper.component';
import { ChatArbitration } from './../../../../../../models/chat/arbitration/chatArbitration';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-arbitration-wrapper',
  templateUrl: './admin-arbitration-wrapper.component.html',
  styleUrls: ['./admin-arbitration-wrapper.component.css']
})
export class AdminArbitrationWrapperComponent implements OnInit {
  @ViewChild(ChatWrapperComponent, {static: false}) chatWrapper: ChatWrapperComponent;
  chats: ChatArbitration[];

  constructor(private chatService: AdminChatService,
      private activeRoute: ActivatedRoute) { 
    this.chats = [];
  }

  ngOnInit() {
    this.applyChangingArbitrationIdParam();
    this.reloadChats();
  }

  applyChangingArbitrationIdParam() {
    this.activeRoute.params.subscribe(params => {
      if(params['arbitrationId']) {
        const arbitrationId = parseInt(params['arbitrationId']);
        this.reloadCurrenArbitration(arbitrationId);
      }
    });
  }

  reloadCurrenArbitration(chatId: number) {
    this.chatService.getArbitrationById(chatId).subscribe(data => {
      this.chatWrapper.reloadCurrentChat(data);
    });
  }

  reloadChats() {
    this.chatService.getMyArbitrations().subscribe((data: ChatArbitration[]) => {
      this.chats = data;
    });
  }

}
