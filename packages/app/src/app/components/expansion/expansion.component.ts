import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-expansion',
  templateUrl: './expansion.component.html',
  styleUrls: ['./expansion.component.scss'],
})
export class ExpansionComponent implements OnInit {
  @Input() label: string = '';

  isExpanded = false;

  constructor() {}

  ngOnInit(): void {}
}
