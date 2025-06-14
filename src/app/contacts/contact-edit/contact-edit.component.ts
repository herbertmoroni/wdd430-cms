import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact | null = null;
  contact: Contact | null = null;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string = '';
  invalidGroupContact: boolean = false;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        if (this.id === undefined || this.id === null) {
          this.editMode = false;
          return;
        }
        this.originalContact = this.contactService.getContact(this.id);
        if (this.originalContact === undefined || this.originalContact === null) {
          return;
        }
        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(this.originalContact));

        if (this.contact && this.contact.group) {
          this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
        }
      }
    );
  }

  onSubmit(form: NgForm) {
    const value = form.value;

    console.log('Form submitted', { value, editMode: this.editMode });

    if (this.editMode) {
      if (this.originalContact) {
        const newContact = new Contact(
          this.originalContact.id,
          value.name,
          value.email,
          value.phone,
          value.imageUrl,
          this.groupContacts.length > 0 ? this.groupContacts : null
        );
        this.contactService.updateContact(this.originalContact, newContact);
        console.log('Contact updated');
      }
    } else {
      const newContact = new Contact(
        '',
        value.name,
        value.email,
        value.phone,
        value.imageUrl,
        this.groupContacts.length > 0 ? this.groupContacts : null
      );
      this.contactService.addContact(newContact);
      console.log('Contact added');
    }

    this.onCancel();
  }

  onCancel() {
    console.log('Cancel clicked');
    this.router.navigate(['/contacts']);
  }

  isInvalidContact(newContact: Contact): boolean {
    if (!newContact) {
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact) {
      this.invalidGroupContact = true;
      setTimeout(() => this.invalidGroupContact = false, 3000);
      return;
    }
    this.invalidGroupContact = false;
    this.groupContacts.push(selectedContact);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
  }
}
