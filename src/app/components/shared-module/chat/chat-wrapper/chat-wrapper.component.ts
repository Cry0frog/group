import { ActivatedRoute } from '@angular/router';
import { ChatContactListComponent } from './chat-contact-list/chat-contact-list.component';
import { ChatArbitration } from './../../../../models/chat/arbitration/chatArbitration';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { BaseChat } from 'src/app/models/chat/baseChat';
import { ChatTemplateComponent } from './chat-template/chat-template.component';

@Component({
  selector: 'app-chat-wrapper',
  templateUrl: './chat-wrapper.component.html',
  styleUrls: ['./chat-wrapper.component.css']
})
export class ChatWrapperComponent implements OnInit, AfterViewInit {
  @ViewChild(ChatTemplateComponent, {static: false}) chatTemplate: ChatTemplateComponent;
  @ViewChild(ChatContactListComponent, {static: false}) chatContactList: ChatContactListComponent;
  @Input() chats: BaseChat[];
  @Input() deletedChats: BaseChat[];
  @Input() isLoadAll: boolean;
  @Output() eventLoadingMore = new EventEmitter();

  isChatNotEmpty: boolean;

  constructor(private activeRoute: ActivatedRoute) {
    this.activeRoute.params.subscribe(params => {
      this.isChatNotEmpty = (params['chatId'] != null || params['arbitrationId'] != null) ? true : false;
    });
  }
  ngAfterViewInit(): void {
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  ngOnInit() {}

  handleEventLoadingMore(event) {
    this.eventLoadingMore.emit();
  }

  reloadCurrentChat(currentChat: BaseChat) {
    this.chatTemplate.reloadCurrentChat(currentChat, false);
  }

  handleSetArbitrations(chat: ChatArbitration) {
    this.chatContactList.setChatArbitration(chat);
  }

  handleCallRefreshArbitration(id: number) {
    this.chatTemplate.refreshCurrentArbitration(id);
  }

}
