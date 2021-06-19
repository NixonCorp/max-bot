import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'MaxBot';
  isLoading = false;
  constructor() {
    this.isLoading = true;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}
