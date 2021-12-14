import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChat } from 'src/app/models/chat/baseChat';
import { ChatMessage } from 'src/app/models/chat/common/chatMessage';
import { ChatTemplateComponent } from '../chat-wrapper/chat-template/chat-template.component';

@Component({
  selector: 'app-online-consultant-chat-wrapper',
  templateUrl: './online-consultant-chat-wrapper.component.html',
  styleUrls: ['./online-consultant-chat-wrapper.component.css']
})
export class OnlineConsultantChatWrapperComponent implements OnInit {

  @ViewChild(ChatTemplateComponent, {static: false}) chatTemplate: ChatTemplateComponent;

  constructor() {}

  ngOnInit() {}
  
  reloadCurrentChat(currentChatWithAdmin: BaseChat) {
    this.chatTemplate.reloadCurrentChat(currentChatWithAdmin, true);
  }

  sendOnlineConsultantMessage(curMessage: ChatMessage) {
    this.chatTemplate.sendOnlineConsultantMessage(curMessage);
  }

}
