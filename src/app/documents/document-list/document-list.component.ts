import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(
      '1',
      'Document 1',
      'Test document 1 description',
      'https://example.com/doc1',
      null
    ),
    new Document(
      '2',
      'Document 2',
      'Test document 2 description',
      'https://example.com/doc2',
      null
    ),
    new Document(
      '3',
      'Document 3',
      'Test document 3 description',
      'https://example.com/doc3',
      null
    )
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
