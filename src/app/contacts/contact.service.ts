import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact | null {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  addContact(contact: Contact) {
    if (!contact) {
      return;
    }
    this.contacts.push(contact);
    this.contactChangedEvent.emit(this.contacts.slice());
  }

  updateContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos >= 0) {
      this.contacts[pos] = contact;
      this.contactChangedEvent.emit(this.contacts.slice());
    }
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    this.contactChangedEvent.emit(this.contacts.slice());
  }
}
