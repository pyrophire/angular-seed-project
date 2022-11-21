import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProgressBarConfig } from 'ix-libs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'CHANGEME-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  use = environment;
  scrollProgressConfig: ProgressBarConfig = {
    backgroundColor: 'transparent',
    barColor: 'red',
    position: 'fixed',
    bottom: 0,
    left: 0
  };
  ngOnInit(): void {}
}
