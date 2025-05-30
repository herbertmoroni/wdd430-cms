import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  @ViewChild('name') name: ElementRef;
  @ViewChild('description') description: ElementRef;
  @ViewChild('url') url: ElementRef;

  document: Document | null = null;
  editMode = false;
  id: string;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params) => {
        this.id = params['id'];
        this.editMode = params['id'] != null;
        if (this.editMode) {
          this.document = this.documentService.getDocument(this.id);
          if (this.document) {
            // Pre-populate form fields
            setTimeout(() => {
              if (this.document) {
                this.name.nativeElement.value = this.document.name;
                this.description.nativeElement.value = this.document.description;
                this.url.nativeElement.value = this.document.url;
              }
            });
          }
        }
      }
    );
  }

  onSave() {
    const nameValue = this.name.nativeElement.value;
    const descriptionValue = this.description.nativeElement.value;
    const urlValue = this.url.nativeElement.value;

    if (this.editMode) {
      // Update existing document
      if (this.document) {
        this.document.name = nameValue;
        this.document.description = descriptionValue;
        this.document.url = urlValue;
        this.documentService.updateDocument(this.document);
      }
    } else {
      // Create new document
      const newDocument = new Document(
        Date.now().toString(), // Simple ID generation
        nameValue,
        descriptionValue,
        urlValue,
        null
      );
      this.documentService.addDocument(newDocument);
    }

    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
