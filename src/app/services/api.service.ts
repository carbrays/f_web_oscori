import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface RouteDetail {
  id: string;
  origin: string;
  destination: string;
  time: string;
  distance: string;
  cargo: string;
  borderCrossing: string;
  cities: string[];
  description: string;
  coordinates: [number, number][]; // Array of [lat, lng]
}

export interface TrackingStep {
  title: string;
  location: string;
  time: string;
  status: 'done' | 'active' | 'pending';
}

export interface TrackingData {
  code: string;
  origin: string;
  destination: string;
  currentStatus: string;
  driver: string;
  driverPhoto?: string;
  plate: string;
  eta: string;
  location: [number, number]; // [lat, lng]
  steps: TrackingStep[];
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  summary: string;
  content: string;
  image: string;
  category: 'logistica' | 'frontera' | 'empresa';
}

export interface Announcement {
  id: number;
  title: string;
  description: string;
  image: string;
  actionText: string;
  actionLink: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Institutional Info Signals
  companyInfo = signal({
    name: 'Transportes OSCORI S.R.L.',
    tagline: 'Líder en Transporte Pesado Internacional Bolivia - Chile',
    history: 'Fundada hace más de 15 años en la ciudad de Oruro, Transportes OSCORI nació con el propósito de conectar de manera eficiente las industrias de Bolivia con los principales puertos del Océano Pacífico en Chile. A lo largo de nuestra trayectoria, hemos consolidado una flota de tractocamiones de última generación y un equipo de profesionales altamente comprometidos.',
    mission: 'Brindar servicios de transporte de carga pesada internacional y nacional con el más alto nivel de seguridad, puntualidad y eficiencia tecnológica, garantizando la plena satisfacción de nuestros clientes mediante una gestión transparente y moderna.',
    vision: 'Ser reconocidos para el 2030 como la empresa líder en soluciones logísticas y transporte transfronterizo en la región andina, distinguiéndonos por nuestra innovación tecnológica, flota premium y sustentabilidad operativa.',
    values: [
      { name: 'Seguridad', desc: 'Priorizamos el resguardo de la vida, de nuestras unidades y del valor de la mercancía de nuestros clientes.' },
      { name: 'Puntualidad', desc: 'Entendemos que el tiempo es un recurso crítico en el comercio internacional.' },
      { name: 'Tecnología', desc: 'Invocamos sistemas de rastreo satelital GPS y telemetría avanzada en toda la flota.' },
      { name: 'Integridad', desc: 'Oramos con honestidad y transparencia en cada cruce fronterizo e inspección aduanera.' }
    ],
    team: [
      { name: 'Ing. Alejandro Oscori', role: 'Gerente General / Fundador', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80' },
      { name: 'Lic. Claudia Oscori', role: 'Directora de Operaciones Binacionales', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
      { name: 'Hugo Choque', role: 'Jefe de Tráfico y Monitoreo GPS', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' }
    ]
  });

  // Client Logos (infinite carousel data)
  clientLogos = signal<string[]>([
    'https://cdn.worldvectorlogo.com/logos/volvo-1.svg',
    'https://cdn.worldvectorlogo.com/logos/scania-1.svg',
    'https://cdn.worldvectorlogo.com/logos/mercedes-benz-9.svg',
    'https://cdn.worldvectorlogo.com/logos/maersk.svg',
    'https://cdn.worldvectorlogo.com/logos/dhl-3.svg',
    'https://cdn.worldvectorlogo.com/logos/dsv-global-transport-logistics.svg',
    'https://cdn.worldvectorlogo.com/logos/kuehne-nagel.svg',
    'https://cdn.worldvectorlogo.com/logos/db-schenker-1.svg'
  ]);

  // Statistics Signals
  stats = signal([
    { value: 15, suffix: '+', title: 'Años de Experiencia', subtitle: 'Liderando el transporte internacional de carga', icon: 'fa-solid fa-calendar-check' },
    { value: 120, suffix: '+', title: 'Tractocamiones Activos', subtitle: 'Flota premium con mantenimiento riguroso', icon: 'fa-solid fa-truck-moving' },
    { value: 500, suffix: 'K+', title: 'Toneladas Transportadas', subtitle: 'Mercancías estratégicas entregadas', icon: 'fa-solid fa-boxes-packing' },
    { value: 4800, suffix: '+', title: 'Viajes Realizados', subtitle: 'Cruces fronterizos exitosos acumulados', icon: 'fa-solid fa-route' },
    { value: 100, suffix: '%', title: 'Entregas Seguras', subtitle: 'Monitoreo satelital constante sin incidentes', icon: 'fa-solid fa-shield-halved' }
  ]);

  // International Routes Mock Database
  private routesDb: RouteDetail[] = [
    {
      id: 'arica-lapaz',
      origin: 'Arica (CL)',
      destination: 'La Paz (BO)',
      time: '18 - 24 Hrs',
      distance: '510 Km',
      cargo: 'Contenedores y Carga General',
      borderCrossing: 'Charaña / Visviri',
      cities: ['Arica', 'Visviri', 'Charaña', 'Viacha', 'La Paz'],
      description: 'Corredor vital para la importación directa de mercadería y bienes de capital que ingresan a Bolivia por el puerto de Arica.',
      coordinates: [
        [-18.4783, -70.3126], // Arica
        [-17.6166, -69.6000], // Visviri / Charaña Border
        [-17.2000, -68.7000], // Viacha
        [-16.5000, -68.1193]  // La Paz
      ]
    },
    {
      id: 'iquique-lapaz',
      origin: 'Iquique (CL)',
      destination: 'La Paz (BO)',
      time: '24 - 30 Hrs',
      distance: '750 Km',
      cargo: 'Línea Blanca, Electrónicos y Vehículos',
      borderCrossing: 'Colchane / Pisiga',
      cities: ['Iquique', 'Huara', 'Colchane', 'Pisiga', 'Oruro', 'La Paz'],
      description: 'Conecta la Zona Franca de Iquique (ZOFRI) con el mercado del occidente boliviano. Ideal para vehículos e insumos industriales.',
      coordinates: [
        [-20.2167, -70.1450], // Iquique
        [-19.6333, -69.9667], // Huara
        [-19.2736, -68.6369], // Colchane / Pisiga Border
        [-17.9647, -67.1060], // Oruro
        [-16.5000, -68.1193]  // La Paz
      ]
    },
    {
      id: 'iquique-oruro',
      origin: 'Iquique (CL)',
      destination: 'Oruro (BO)',
      time: '20 - 26 Hrs',
      distance: '620 Km',
      cargo: 'Minerales y Repuestos Pesados',
      borderCrossing: 'Colchane / Pisiga',
      cities: ['Iquique', 'Huara', 'Colchane', 'Pisiga', 'Sabaya', 'Oruro'],
      description: 'Ruta preferencial para el transporte de maquinaria pesada destinada a la minería en el departamento de Oruro.',
      coordinates: [
        [-20.2167, -70.1450], // Iquique
        [-19.2736, -68.6369], // Colchane / Pisiga
        [-18.7500, -68.1500], // Sabaya
        [-17.9647, -67.1060]  // Oruro
      ]
    },
    {
      id: 'arica-oruro',
      origin: 'Arica (CL)',
      destination: 'Oruro (BO)',
      time: '16 - 22 Hrs',
      distance: '480 Km',
      cargo: 'Carga General y Granel',
      borderCrossing: 'Tambo Quemado / Chungará',
      cities: ['Arica', 'Putre', 'Chungará', 'Tambo Quemado', 'Patacamaya', 'Oruro'],
      description: 'El corredor bioceánico más transitado, cruzando el altiplano a más de 4,600 metros de altura en el paso fronterizo Chungará.',
      coordinates: [
        [-18.4783, -70.3126], // Arica
        [-18.1964, -69.5593], // Putre / Chungará Border
        [-18.2800, -69.0400], // Tambo Quemado
        [-17.2667, -67.9167], // Patacamaya
        [-17.9647, -67.1060]  // Oruro
      ]
    },
    {
      id: 'iquique-cochabamba',
      origin: 'Iquique (CL)',
      destination: 'Cochabamba (BO)',
      time: '32 - 40 Hrs',
      distance: '980 Km',
      cargo: 'Insumos Agrícolas y Alimentos',
      borderCrossing: 'Colchane / Pisiga',
      cities: ['Iquique', 'Colchane', 'Pisiga', 'Oruro', 'Cochabamba'],
      description: 'Abastecimiento directo del valle cochabambino con maquinaria e insumos industriales importados desde Iquique.',
      coordinates: [
        [-20.2167, -70.1450], // Iquique
        [-19.2736, -68.6369], // Pisiga
        [-17.9647, -67.1060], // Oruro
        [-17.3895, -66.1568]  // Cochabamba
      ]
    },
    {
      id: 'arica-cochabamba',
      origin: 'Arica (CL)',
      destination: 'Cochabamba (BO)',
      time: '28 - 34 Hrs',
      distance: '840 Km',
      cargo: 'Equipamiento Médico e Industrial',
      borderCrossing: 'Tambo Quemado',
      cities: ['Arica', 'Tambo Quemado', 'Patacamaya', 'Cochabamba'],
      description: 'Transporte de alta precisión para el equipamiento de empresas en el eje troncal de Cochabamba.',
      coordinates: [
        [-18.4783, -70.3126], // Arica
        [-18.2800, -69.0400], // Tambo Quemado
        [-17.2667, -67.9167], // Patacamaya
        [-17.3895, -66.1568]  // Cochabamba
      ]
    },
    {
      id: 'iquique-santacruz',
      origin: 'Iquique (CL)',
      destination: 'Santa Cruz (BO)',
      time: '42 - 50 Hrs',
      distance: '1,380 Km',
      cargo: 'Acero, Bobinas y Repuestos Industriales',
      borderCrossing: 'Colchane / Pisiga',
      cities: ['Iquique', 'Pisiga', 'Oruro', 'Cochabamba', 'Santa Cruz'],
      description: 'La ruta más larga y exigente que conecta la costa chilena con el motor agroindustrial del oriente de Bolivia.',
      coordinates: [
        [-20.2167, -70.1450], // Iquique
        [-19.2736, -68.6369], // Pisiga
        [-17.9647, -67.1060], // Oruro
        [-17.3895, -66.1568], // Cochabamba
        [-17.7833, -63.1821]  // Santa Cruz
      ]
    },
    {
      id: 'arica-santacruz',
      origin: 'Arica (CL)',
      destination: 'Santa Cruz (BO)',
      time: '38 - 46 Hrs',
      distance: '1,240 Km',
      cargo: 'Soya, Madera (Exportación) / Químicos (Importación)',
      borderCrossing: 'Tambo Quemado',
      cities: ['Arica', 'Tambo Quemado', 'Oruro', 'Cochabamba', 'Santa Cruz'],
      description: 'Corredor clave para exportación agroindustrial de soya y subproductos hacia mercados de ultramar por Arica.',
      coordinates: [
        [-18.4783, -70.3126], // Arica
        [-18.2800, -69.0400], // Tambo Quemado
        [-17.9647, -67.1060], // Oruro
        [-17.3895, -66.1568], // Cochabamba
        [-17.7833, -63.1821]  // Santa Cruz
      ]
    }
  ];

  // News / Advisos Mock Database
  newsItems = signal<NewsItem[]>([
    {
      id: 1,
      title: 'Habilitación de horario continuo en Paso Fronterizo Tambo Quemado',
      date: '28 de Julio, 2026',
      summary: 'Aduanas de Bolivia y Chile acuerdan extender el horario operativo para agilizar el cruce de tractocamiones de carga pesada.',
      content: 'En una reunión binacional entre las autoridades de la Aduana Nacional de Bolivia y el Servicio Nacional de Aduanas de Chile, se ha establecido la habilitación del horario continuo de 24 horas para el transporte internacional de carga en el paso fronterizo Tambo Quemado - Chungará. Esta medida busca reducir las filas de camiones y acortar los tiempos de espera hasta en un 40%, beneficiando directamente a los importadores y exportadores bolivianos.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
      category: 'frontera'
    },
    {
      id: 2,
      title: 'Adquisición de 15 Nuevos Tractocamiones Scania R540 V8 XT',
      date: '15 de Julio, 2026',
      summary: 'Transportes OSCORI moderniza su flota con camiones de última generación equipados con tecnología de reducción de emisiones Euro 6.',
      content: 'Comprometidos con el liderazgo logístico y la sostenibilidad, en Transportes OSCORI hemos concretado la incorporación de 15 nuevas unidades Scania R540 V8 de la serie XT. Estos vehículos cuentan con la máxima potencia de arrastre requerida para las exigentes altitudes de la Cordillera de los Andes, sistemas avanzados de asistencia a la conducción (ADAS) y telemetría GPS integrada para la seguridad total de la carga.',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80',
      category: 'empresa'
    },
    {
      id: 3,
      title: 'Digitalización Aduanera: Implementación obligatoria de la Carpeta Digital MIC/DTA',
      date: '02 de Julio, 2026',
      summary: 'Nuevos lineamientos digitales para agilizar las operaciones de tránsito aduanero internacional entre puertos chilenos y Bolivia.',
      content: 'A partir de este mes, entra en vigencia el nuevo portal de digitalización para la emisión de Manifiestos de Carga Internacional (MIC/DTA). Nuestro departamento de operaciones ya cuenta con el 100% del personal capacitado y certificado para operar en esta plataforma digital. Esto nos permite garantizar un despacho portuario en menos de 4 horas tras el desembarque en los puertos de Arica e Iquique.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
      category: 'logistica'
    }
  ]);

  // Announcement modal mockup
  announcement = signal<Announcement>({
    id: 101,
    title: 'OPERACIÓN CORREDOR INVIERNO 2026',
    description: 'Nuestras unidades se encuentran circulando con equipamiento anticongelante y escoltas de seguridad en las rutas andinas. Garantizamos el tránsito en la frontera a pesar de las bajas temperaturas.',
    image: 'https://images.unsplash.com/photo-1482867996988-2faec3cbb4f9?w=500&auto=format&fit=crop&q=80',
    actionText: 'Ver Estado de Rutas',
    actionLink: '/rutas'
  });

  // GPS Tracking Mock Database
  private trackingDb: Record<string, TrackingData> = {
    'OSC-7301-CL': {
      code: 'OSC-7301-CL',
      origin: 'Puerto Iquique (Chile)',
      destination: 'Santa Cruz (Bolivia)',
      currentStatus: 'En Tránsito Internacional (Frontera)',
      driver: 'Hugo Choque Mamani',
      driverPhoto: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=120&auto=format&fit=crop&q=80',
      plate: 'Mercedes-Benz Actros V8 | Carga: 28 Toneladas',
      eta: '04 de Agosto, 2026 - 15:00 PM (Aprox)',
      location: [-19.2736, -68.6369], // Paso Colchane/Pisiga
      steps: [
        { title: 'Contenedor Embarcado y Estibado', location: 'Puerto de Iquique (CL)', time: '01 de Agosto, 2026 - 08:30 AM', status: 'done' },
        { title: 'Tránsito Carretero Chile e Inspección', location: 'Huara - Control de Ruta Carabineros (CL)', time: '01 de Agosto, 2026 - 15:40 PM', status: 'done' },
        { title: 'Cruce de Frontera y Liberación MIC/DTA', location: 'Frontera Colchane - Pisiga Aduana (BO)', time: '02 de Agosto, 2026 - 06:15 AM (Último Registro)', status: 'active' },
        { title: 'Descarga final y Precinto Satisfecho', location: 'Parque Industrial PI-04, Santa Cruz (BO)', time: 'Pendiente en Itinerario', status: 'pending' }
      ]
    },
    'OSC-9844-BO': {
      code: 'OSC-9844-BO',
      origin: 'Planta El Alto (Bolivia)',
      destination: 'Puerto Arica (Chile)',
      currentStatus: 'Carga Entregada con Éxito',
      driver: 'Rodrigo Mendoza Tapia',
      driverPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      plate: 'Volvo FH 540 Globetrotter | Carga: Mineral Soya',
      eta: 'Entregado el 31 de Julio, 2026 - 14:15 PM',
      location: [-18.4783, -70.3126], // Puerto Arica
      steps: [
        { title: 'Carga y Emisión MIC/DTA en Planta', location: 'Complejo Industrial El Alto (BO)', time: '29 de Julio, 2026 - 09:00 AM', status: 'done' },
        { title: 'Tránsito Altiplánico y Aduana Salida', location: 'Tambo Quemado - Resguardo Aduana (BO)', time: '30 de Julio, 2026 - 10:20 AM', status: 'done' },
        { title: 'Ingreso al Puerto y Descarga', location: 'Puerto de Arica, Antepuerto (CL)', time: '31 de Julio, 2026 - 08:00 AM', status: 'done' },
        { title: 'Contenedor Entregado en Patio de Naviera', location: 'Puerto de Arica - Terminal 02 (CL)', time: '31 de Julio, 2026 - 14:15 PM', status: 'done' }
      ]
    }
  };

  // Get list of routes (Observable)
  getRoutes(): Observable<RouteDetail[]> {
    return of(this.routesDb).pipe(delay(200));
  }

  // Get specific route details
  getRouteById(id: string): RouteDetail | undefined {
    return this.routesDb.find(r => r.id === id);
  }

  // Query Tracking satelital GPS
  getTracking(code: string): Observable<TrackingData | null> {
    const cleanCode = code.trim().toUpperCase();
    if (this.trackingDb[cleanCode]) {
      return of(this.trackingDb[cleanCode]).pipe(delay(1200));
    }
    return of(null).pipe(delay(800));
  }
}
