import { ChatWrapperComponent } from './../../../../shared-module/chat/chat-wrapper/chat-wrapper.component';
import { ChatArbitration } from './../../../../../models/chat/arbitration/chatArbitration';
import { ChatService } from './../../../../shared-module/service/chat.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-arbitration-chat',
  templateUrl: './arbitration-chat.component.html',
  styleUrls: ['./arbitration-chat.component.css']
})
export class ArbitrationChatComponent implements OnInit {
  @ViewChild(ChatWrapperComponent, {static: false}) chatWrapper: ChatWrapperComponent;
  paramsSubscription : Subscription;
  chats: ChatArbitration[];

  constructor(private chatService: ChatService,
      private activeRoute: ActivatedRoute) {
    this.chats = [];
  }

  ngOnInit() {
    this.applyChangingChatIdParam();
    this.reloadChats();
  }

  applyChangingChatIdParam() {
    this.paramsSubscription = this.activeRoute.params.subscribe(params => {
      if(params['chatId']) {
        const chatId = parseInt(params['chatId']);
        this.reloadCurrenChat(chatId);
      }
    });
  }

  reloadCurrenChat(chatId: number) {
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
