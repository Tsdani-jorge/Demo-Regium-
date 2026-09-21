# Regium Transporte Ejecutivo — Sitio oficial

Sitio de **Regium Transporte Ejecutivo**: traslados privados con reservación previa en la Ciudad de México, zona metropolitana y aeropuertos (AICM, AIFA y Toluca).

---

## Dirección de diseño

* **Editorial y sobria:** titulares en serif (Cormorant) con texto en grotesca (Hanken Grotesk); negro cálido, marfil y un único acento latón.
* **Fotografía a sangre** en la portada y en el cierre, con paralaje lento.
* **Estructura con líneas finas** en lugar de tarjetas: servicios como índice, especificaciones del vehículo como ficha técnica y políticas como tabla.
* **Flota en carrusel giratorio 3D:** Suburban, Escalade, Yukon, sedán y Bolt EUV en un anillo que rota solo, con flechas, teclado y arrastre; la silueta de cada unidad se dibuja al quedar al frente.
* **Animaciones:** telón de entrada (una vez por sesión), titulares que suben palabra por palabra, líneas finas que se dibujan, fotografía de cierre que se abre como ventana. Todo respeta `prefers-reduced-motion`.
* **Móvil:** menú a pantalla completa y barra inferior con "Llamar" y "Cotizar por WhatsApp" que aparece al bajar.
* **WhatsApp:** cada botón abre una solicitud de cotización prellenada con el servicio, salida y destino.

---

## Tecnologías

| Tecnología | Propósito |
| :--- | :--- |
| **Vite** | Servidor de desarrollo y compilación |
| **GSAP + ScrollTrigger** | Apariciones y paralaje al desplazarse |
| **Lenis** | Desplazamiento suave |
| **CSS** | Sistema de diseño con variables, sin framework |

---

## Inicio Rápido (Desarrollo Local)

### Prerrequisitos
* Node.js v18+ instalado
* Gestor de paquetes npm

### 1. Clonar el repositorio
```bash
git clone https://github.com/Tsdani-jorge/Demo-Regium-.git
cd Demo-Regium-
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar servidor de desarrollo
```bash
npm run dev
```
Abre en tu navegador: `http://localhost:5173/`

### 4. Compilar para producción
```bash
npm run build
```
Los archivos optimizados se generarán en la carpeta `dist/`.

---

## Despliegue en GitHub Pages

Este repositorio incluye una acción de **GitHub Actions** (`.github/workflows/deploy.yml`) lista para publicar el sitio automáticamente:

1. Ve a tu repositorio en GitHub: **Settings** > **Pages**.
2. En **Build and deployment** > **Source**, selecciona **GitHub Actions**.
3. Cada vez que hagas un `git push` a la rama `main`, el sitio se compilará y publicará de forma automática y gratuita.

---

## Estructura del Proyecto

```
├── .github/
│   └── workflows/
│       └── deploy.yml        # Despliegue automático a GitHub Pages
├── public/
│   └── images/
│       ├── bellas-artes-hero.jpg # Fotografía de portada
│       └── catedral-hero.jpg     # Fotografía de cierre
├── src/
│   ├── scripts/
│   │   ├── concierge.js      # Enlaces de WhatsApp con la solicitud prellenada
│   │   ├── fleet.js          # Carrusel giratorio de la flota
│   │   └── main.js           # Desplazamiento, menú móvil y animaciones
│   └── styles/
│       └── main.css          # Sistema de diseño y responsive
├── index.html                # Estructura semántica principal
├── vite.config.js            # Configuración de rutas relativas y build
├── package.json              # Dependencias y scripts
└── .gitignore                # Exclusiones de control de versiones
```

---

## Contacto & Licencia

* **Regium Transporte Ejecutivo**
* WhatsApp: [+52 81 1474 9578](https://wa.me/528114749578)
* Correo: [reserva@regium.com.mx](mailto:reserva@regium.com.mx)
* © 2026 Regium. Todos los derechos reservados.
