import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  @ViewChild('name') name: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('phone') phone: ElementRef;
  @ViewChild('imageUrl') imageUrl: ElementRef;

  contact: Contact | null = null;
  editMode = false;
  id: string;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params) => {
        this.id = params['id'];
        this.editMode = params['id'] != null;
        if (this.editMode) {
          this.contact = this.contactService.getContact(this.id);
          if (this.contact) {
            // Pre-populate form fields
            setTimeout(() => {
              if (this.contact) {
                this.name.nativeElement.value = this.contact.name;
                this.email.nativeElement.value = this.contact.email;
                this.phone.nativeElement.value = this.contact.phone;
                this.imageUrl.nativeElement.value = this.contact.imageUrl;
              }
            });
          }
        }
      }
    );
  }

  onSave() {
    const nameValue = this.name.nativeElement.value;
    const emailValue = this.email.nativeElement.value;
    const phoneValue = this.phone.nativeElement.value;
    const imageUrlValue = this.imageUrl.nativeElement.value;

    if (this.editMode) {
      // Update existing contact
      if (this.contact) {
        this.contact.name = nameValue;
        this.contact.email = emailValue;
        this.contact.phone = phoneValue;
        this.contact.imageUrl = imageUrlValue;
        this.contactService.updateContact(this.contact);
      }
    } else {
      // Create new contact
      const newContact = new Contact(
        Date.now().toString(), // Simple ID generation
        nameValue,
        emailValue,
        phoneValue,
        imageUrlValue,
        null
      );
      this.contactService.addContact(newContact);
    }

    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
