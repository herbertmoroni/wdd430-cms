import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new Subject<Message[]>();
  maxMessageId: number;

  private baseUrl = 'https://wdd-400-default-rtdb.firebaseio.com/messages.json';

  constructor(private http: HttpClient) {
    this.maxMessageId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;

    for (const message of this.messages) {
      const currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  getMessages(): Message[] {
    this.http.get<Message[]>(this.baseUrl)
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();
          this.messageChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.log(error);
        }
      );

    return this.messages.slice();
  }

  getMessage(id: string): Message | null {
    for (const message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    this.maxMessageId++;
    message.id = this.maxMessageId.toString();
    this.messages.push(message);
    this.storeMessages();
  }

  storeMessages() {
    const messagesString = JSON.stringify(this.messages);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put(this.baseUrl, messagesString, { headers: headers })
      .subscribe(
        () => {
          this.messageChangedEvent.next(this.messages.slice());
        }
      );
  }
}
