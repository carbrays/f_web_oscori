import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio').then(m => m.InicioComponent),
    title: 'Transportes OSCORI | Inicio'
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./pages/nosotros/nosotros').then(m => m.NosotrosComponent),
    title: 'Transportes OSCORI | Nosotros'
  },
  {
    path: 'servicios',
    loadComponent: () => import('./pages/servicios/servicios').then(m => m.ServiciosComponent),
    title: 'Transportes OSCORI | Servicios de Transporte'
  },
  {
    path: 'rutas',
    loadComponent: () => import('./pages/rutas/rutas').then(m => m.RutasComponent),
    title: 'Transportes OSCORI | Rutas Internacionales BO - CL'
  },
  {
    path: 'seguimiento',
    loadComponent: () => import('./pages/seguimiento/seguimiento').then(m => m.SeguimientoComponent),
    title: 'Transportes OSCORI | Seguimiento Satelital GPS'
  },
  {
    path: 'noticias',
    loadComponent: () => import('./pages/noticias/noticias').then(m => m.NoticiasComponent),
    title: 'Transportes OSCORI | Noticias y Comunicados'
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contacto/contacto').then(m => m.ContactoComponent),
    title: 'Transportes OSCORI | Contacto'
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];
