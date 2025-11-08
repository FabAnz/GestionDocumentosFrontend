# Estructura de Componentes

Esta carpeta sigue la metodología **Atomic Design** para mantener una organización clara y escalable de los componentes.

## Estructura de Carpetas

### `/ui`
Componentes base de **shadcn/ui**. Estos son componentes primitivos reutilizables que sirven como base para otros componentes.
- `avatar.jsx` - Componente de avatar de usuario
- `tooltip.jsx` - Componente de tooltip

### `/atoms`
Componentes básicos e indivisibles, completamente reutilizables sin dependencias. Estos son los bloques fundamentales de la interfaz.
- Ejemplos: Botones básicos, inputs, labels, etc.

### `/molecules`
Combinaciones simples de átomos. Componentes reutilizables que pueden depender de átomos.
- Ejemplos: Formularios simples, cards básicas, grupos de inputs, etc.

### `/organisms`
Componentes complejos formados por moléculas y átomos. Representan secciones completas de la interfaz.
- `Navbar.jsx` - Barra de navegación principal con perfil de usuario

### `/templates`
Estructuras de diseño sin contenido real. Definen la disposición de organismos en la página.

### `/pages`
Instancias específicas con contenido real. Componentes de página completos que usan templates y organisms.
- `Dashboard.jsx` - Página principal del dashboard

## Convenciones

- **Nomenclatura**: PascalCase para nombres de archivos (`ComponentName.jsx`)
- **Imports**: Usar alias `@/components` configurado en `jsconfig.json`
- **Componentes UI**: Mantener en `/ui` todos los componentes de shadcn/ui
- **Componentes personalizados**: Organizar según su nivel de complejidad (atom → molecule → organism)

## Guía para Agregar Componentes

1. **¿Es un componente de shadcn/ui?** → `/ui`
2. **¿Es un componente básico sin dependencias de otros componentes personalizados?** → `/atoms`
3. **¿Combina 2-3 átomos?** → `/molecules`
4. **¿Es una sección compleja con múltiples elementos?** → `/organisms`
5. **¿Define el layout general?** → `/templates`
6. **¿Es una página completa?** → `/pages`

