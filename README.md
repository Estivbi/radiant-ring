# Landing Page de Custodio José Pérez Pérez - Escritor

Este proyecto es una landing page para el escritor Custodio José Pérez Pérez, donde puede mostrar y vender sus libros.

## 🚀 Características

- Diseño creativo y original con temática
- Secciones para mostrar libros del autor
- Información sobre el autor
- Blog
- Opciones de contacto y compra
- Animaciones y elementos visuales atractivos
- Diseño responsive para dispositivos móviles y de escritorio

## 🛠️ Tecnologías

- [Astro](https://astro.build/) - Framework web para sitios estáticos y dinámicos
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [React](https://reactjs.org/) - Biblioteca JavaScript para componentes interactivos

## 📦 Estructura del Proyecto

```
landing-libros/
├── public/               # Archivos estáticos (imágenes, favicon, etc.)
├── src/
│   ├── assets/           # Imágenes y recursos utilizados en el código
│   ├── components/       # Componentes reutilizables
│   │   ├── AuthorSection.astro
│   │   ├── BookSection.astro
│   │   ├── ContactSection.astro
│   │   ├── Gallery.tsx
│   │   ├── Hero.astro
│   │   ├── Navbar.astro
│   │   └── Welcome.astro
│   ├── layouts/          # Plantillas de diseño
│   │   └── Layout.astro
│   ├── pages/            # Páginas del sitio
│   │   ├── index.astro   # Página principal
│   │   └── blog.astro    # Página de blog
│   └── styles/           # Estilos globales
│       └── global.css    # Estilos Tailwind y personalizados
```

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto, desde una terminal:

| Comando                | Acción                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Instala dependencias                             |
| `npm run dev`          | Inicia servidor local en `localhost:4321`        |
| `npm run build`        | Construye el sitio para producción               |
| `npm run preview`      | Vista previa del build antes de desplegar        |

## 📝 Personalización

Para personalizar esta landing page para otro autor o propósito:

1. Modifica los datos de ejemplo en `src/pages/index.astro` y `src/pages/blog.astro`
2. Reemplaza las imágenes de placeholder con imágenes reales
3. Actualiza los textos y la información de contacto
4. Personaliza los colores en `src/styles/global.css`

## 🎨 Estilo y Tono

- Diseño colorido y divertido
- Referencias a la cultura geek
- No demasiado formal o corporativo

## 📚 Créditos

Desarrollado con Astro, Tailwind CSS y React.