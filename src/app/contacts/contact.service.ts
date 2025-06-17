import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];
  contactSelectedEvent = new Subject<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  private baseUrl = 'https://wdd-400-default-rtdb.firebaseio.com/contacts.json';

  constructor(private http: HttpClient) {
    this.maxContactId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;

    for (const contact of this.contacts) {
      const currentId = parseInt(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  getContacts(): Contact[] {
    this.http.get<Contact[]>(this.baseUrl)
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          this.contacts.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error: any) => {
          console.log(error);
        }
      );

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

    this.maxContactId++;
    contact.id = this.maxContactId.toString();
    this.contacts.push(contact);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts();
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
    this.storeContacts();
  }

  storeContacts() {
    const contactsString = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put(this.baseUrl, contactsString, { headers: headers })
      .subscribe(
        () => {
          this.contactListChangedEvent.next(this.contacts.slice());
        }
      );
  }
}
