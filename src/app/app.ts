import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { ScrollTruckComponent } from './components/scroll-truck/scroll-truck';
import { AnnouncementPopupComponent } from './components/announcement-popup/announcement-popup';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ScrollTruckComponent,
    AnnouncementPopupComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
// export class App {
//   protected title = 'transportes-oscori';
// }
export class App implements OnInit {
  protected title = 'transportes-oscori';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      document.body.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    });
  }
}