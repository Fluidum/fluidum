import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fluidum-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  navLinks: any[] = [
    {
      label: 'Landing',
      link: './home',
      index: 0,
    },
    {
      label: 'Dashboard',
      link: './dashboard',

      index: 1,
    },
    {
      label: 'Debug Contract',
      link: './debug',  
      index: 5,
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
