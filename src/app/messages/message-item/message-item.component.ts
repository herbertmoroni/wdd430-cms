import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  messageSender: string;

  constructor() { } // Remove ContactService - we don't need it anymore

  ngOnInit(): void {
    // Use the senderName that comes from the backend
    this.messageSender = this.message.senderName || `User ${this.message.sender}`;
  }
}
