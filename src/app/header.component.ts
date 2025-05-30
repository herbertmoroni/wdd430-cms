import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  collapsed = true;

  constructor() { }

  ngOnInit(): void {
  }
}
