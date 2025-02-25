import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'ix-tf-icon',
    templateUrl: './tf-icon.component.html',
    styleUrls: ['./tf-icon.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class TfIconComponent implements OnInit {
  @Input() data: boolean;

  constructor() {}

  ngOnInit(): void {}
}
