import { Component, Input } from '@angular/core';

@Component({
  selector: 'loader',
  providers: [],
  templateUrl: 'loader.html',
})

export class LoaderComponent {
  @Input() color: string = 'blue';
  @Input() state: string = 'wait';
  constructor( ) {
  }
}
