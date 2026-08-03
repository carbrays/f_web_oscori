import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface RouteStop {
  id: string;
  name: string;
  progress: number;
}

@Component({
  selector: 'app-scroll-truck',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scroll-truck-timeline d-none d-xl-flex" *ngIf="isInicioPage()">
      <div class="scroll-truck-line">
        <div class="scroll-truck-progress" [style.height.%]="scrollProgress()"></div>
        <div class="scroll-truck-icon" [style.top.%]="scrollProgress()">
          <i class="fa-solid fa-truck-moving"></i>
        </div>
      </div>
      <div class="scroll-truck-dots-container">
        <div 
          *ngFor="let stop of stops"
          class="scroll-truck-dot"
          [class.active]="scrollProgress() >= stop.progress"
          [attr.data-label]="stop.name"
          [style.top.%]="stop.progress"
          (click)="scrollToPercentage(stop.progress)"
          [title]="stop.name"
        ></div>
      </div>
    </div>
  `,
  styles: [`
    .scroll-truck-dots-container {
      height: 100%;
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
    }
    .scroll-truck-dot {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `]
})
export class ScrollTruckComponent implements OnInit, OnDestroy {
  scrollProgress = signal<number>(0);
  isInicioPage = signal<boolean>(false);

  stops: RouteStop[] = [
    { id: 'chile', name: 'Inicio (Chile)', progress: 0 },
    { id: 'iquique', name: 'Puerto Iquique', progress: 14 },
    { id: 'arica', name: 'Puerto Arica', progress: 28 },
    { id: 'pisiga', name: 'Frontera Pisiga', progress: 42 },
    { id: 'tambo', name: 'Frontera Tambo Quemado', progress: 57 },
    { id: 'oruro', name: 'Oruro', progress: 71 },
    { id: 'lapaz', name: 'La Paz', progress: 85 },
    { id: 'santacruz', name: 'Santa Cruz (Destino)', progress: 100 }
  ];

  private routeSubscription: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkRoute(this.router.url);

    this.routeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkRoute(event.urlAfterRedirects);
    });

    // Escuchamos el scroll de body directamente, sin pasar por Zone/HostListener
    document.body.addEventListener('scroll', this.onBodyScroll, { passive: true });

    setTimeout(() => this.onBodyScroll(), 200);
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
    document.body.removeEventListener('scroll', this.onBodyScroll);
  }

  checkRoute(url: string) {
    const isInicio = url === '/' || url === '' || url.startsWith('/inicio');
    this.isInicioPage.set(isInicio);
  }

  private onBodyScroll = () => {
    if (!this.isInicioPage()) return;

    const scrollTop = document.body.scrollTop;
    const docHeight = document.body.scrollHeight - document.body.clientHeight;

    if (docHeight > 0) {
      const pct = (scrollTop / docHeight) * 100;
      this.scrollProgress.set(Math.min(Math.max(pct, 0), 100));
    }
  }

  scrollToPercentage(percent: number) {
    const docHeight = document.body.scrollHeight - document.body.clientHeight;
    document.body.scrollTo({ top: (percent / 100) * docHeight, behavior: 'smooth' });
  }
}