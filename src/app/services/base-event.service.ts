import { ApiUrls } from './../auth/activeUrls';
import { Subject, Observable } from 'rxjs';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

/*
npm install stompjs
npm install sockjs-client
npm install net
*/

export abstract class BaseEventService {
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  protected stompClient;
  protected subject: Subject<MessageEvent>;
  protected endpoint: string;

  public dispose() {
    console.log('Service destroy');
    if(this.stompClient != null) {
      if(this.stompClient.connected) {
        this.stompClient.unsubscribe(this.endpoint);
        this.stompClient.disconnect();
      }
      this.stompClient = null;
    }
  }

  protected connectWrapper(): Observable<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create();
    }

    return this.subject;
  }

  protected create(): Subject<MessageEvent> {
    if (this.stompClient != null) {
      return null;
    }
    
    const websocketUrl = ApiUrls.COMMON_INTERACTIVE;
    console.log('BaseEventService: ' + websocketUrl);
    const ws = new SockJS(websocketUrl);
    this.stompClient = Stomp.over(ws);

    this.stompClient.connect({}, () => {
      if (this.stompClient.subscriptions != null) {
        for (const sub in this.stompClient.subscriptions) {
          if (this.stompClient.subscriptions.hasOwnProperty(sub)) {
            this.stompClient.unsubscribe(sub);
          }
        }
      }

      this.subscribeHandler();
    });
    return null;
  }

  protected abstract subscribeHandler();

}
