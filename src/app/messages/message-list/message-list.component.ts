import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message('1', 'Subject 1', 'Message text 1', 'John Doe'),
    new Message('2', 'Subject 2', 'Message text 2', 'Jane Smith'),
    new Message('3', 'Subject 3', 'Message text 3', 'Bob Johnson')
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
