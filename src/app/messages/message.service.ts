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

  constructor(private http: HttpClient) {}

  getMessages(): Message[] {
    this.http.get<{ message: string, messages: Message[] }>('http://localhost:3000/api/messages')
      .subscribe(
        (responseData) => {
          this.messages = responseData.messages;
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

    // make sure id of the new Message is empty
    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, messageData: Message }>('http://localhost:3000/api/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new message to messages
          this.messages.push(responseData.messageData);
          this.messageChangedEvent.next(this.messages.slice());
        }
      );
  }

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) {
      return;
    }

    const pos = this.messages.findIndex(m => m.id === originalMessage.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Message to the id of the old Message
    newMessage.id = originalMessage.id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/api/messages/' + originalMessage.id,
      newMessage, { headers: headers })
      .subscribe(
        (response: any) => {
          this.messages[pos] = newMessage;
          this.messageChangedEvent.next(this.messages.slice());
        }
      );
  }

  deleteMessage(message: Message) {
    if (!message) {
      return;
    }

    const pos = this.messages.findIndex(m => m.id === message.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/api/messages/' + message.id)
      .subscribe(
        (response: any) => {
          this.messages.splice(pos, 1);
          this.messageChangedEvent.next(this.messages.slice());
        }
      );
  }
}
