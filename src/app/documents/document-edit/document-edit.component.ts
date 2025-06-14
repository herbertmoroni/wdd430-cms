import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document | null = null;
  document: Document | null = null;
  editMode: boolean = false;
  id: string = '';

  constructor(
    private documentService: DocumentService,
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
        this.originalDocument = this.documentService.getDocument(this.id);
        if (this.originalDocument === undefined || this.originalDocument === null) {
          return;
        }
        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
      }
    );
  }

  onSubmit(form: NgForm) {
    const value = form.value;

    console.log('Form submitted', { value, editMode: this.editMode });

    if (this.editMode) {
      if (this.originalDocument) {
        const newDocument = new Document(
          this.originalDocument.id,
          value.name,
          value.description,
          value.url,
          null
        );
        this.documentService.updateDocument(this.originalDocument, newDocument);
        console.log('Document updated');
      }
    } else {
      const newDocument = new Document(
        '',
        value.name,
        value.description,
        value.url,
        null
      );
      this.documentService.addDocument(newDocument);
      console.log('Document added');
    }

    this.onCancel();
  }

  onCancel() {
    console.log('Cancel clicked');
    this.router.navigate(['/documents']);
  }
}
