import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
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
export class App {
  protected title = 'transportes-oscori';
}
