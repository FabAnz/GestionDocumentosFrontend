# Estructura de Componentes - Guía para Agentes

Este documento explica la organización de la carpeta `src/components/` siguiendo la metodología **Atomic Design**. Usa esta guía para determinar dónde crear nuevos componentes y mantener la consistencia del proyecto.

---

## 📁 Estructura de Carpetas

```
src/components/
├── atoms/          # Componentes básicos e indivisibles
├── molecules/      # Combinaciones simples de átomos
├── organisms/      # Componentes complejos con múltiples elementos
├── templates/      # Estructuras de diseño sin contenido real
├── pages/          # Páginas completas con contenido específico
├── ui/             # Componentes de shadcn/ui (mantener separados)
└── README.md       # Documentación de la estructura
```

---

## 🎯 Descripción de Cada Nivel

### `/atoms` - Componentes Atómicos

**Definición**: Componentes básicos e indivisibles, completamente reutilizables sin dependencias de otros componentes personalizados.

**Características**:
- No dependen de otros componentes personalizados del proyecto
- Pueden usar componentes de `/ui` (shadcn/ui)
- Altamente reutilizables en todo el proyecto
- Ejemplos de nivel atómico: botones básicos personalizados, inputs personalizados, labels, badges, iconos personalizados, spinners

**Ejemplo conceptual**:
```jsx
// atoms/CustomButton.jsx
export const CustomButton = ({ children, variant, ...props }) => {
  return <button className={getVariantStyles(variant)} {...props}>{children}</button>
}
```

**❌ NO son átomos**:
- Componentes que combinan múltiples elementos visuales
- Componentes que dependen de otros componentes personalizados (fuera de `/ui`)

---

### `/molecules` - Moléculas

**Definición**: Combinaciones simples de átomos o componentes básicos. Representan grupos de elementos que trabajan juntos.

**Características**:
- Combinan 2-4 átomos o componentes básicos
- Pueden depender de componentes de `/atoms` y `/ui`
- Son reutilizables pero más específicos que los átomos
- Ejemplos: formularios simples, cards básicas, grupos de inputs con labels, botones con tooltips, listas de items simples

**Ejemplo conceptual**:
```jsx
// molecules/SearchForm.jsx
import { Input } from '@/components/ui/input'  // de /ui
import { Button } from '@/components/atoms/CustomButton'  // de /atoms
import { Label } from '@/components/ui/label'  // de /ui

export const SearchForm = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <Label>Buscar</Label>
      <Input type="search" />
      <Button type="submit">Buscar</Button>
    </form>
  )
}
```

**❌ NO son moléculas**:
- Componentes con más de 4-5 elementos visuales distintos
- Componentes que representan secciones completas de la interfaz

---

### `/organisms` - Organismos

**Definición**: Componentes complejos formados por moléculas y/o átomos. Representan secciones completas y funcionales de la interfaz.

**Características**:
- Combinan múltiples moléculas y/o átomos
- Representan funcionalidades complejas completas
- Pueden tener su propia lógica de estado y efectos
- Ejemplos: Navbar, Sidebar, Formularios complejos con múltiples secciones, Tablas de datos con acciones, Paneles de estadísticas

**Ejemplo real en el proyecto**:
```12:53:src/components/organisms/Navbar.jsx
// organisms/Navbar.jsx
// Combina Avatar, Tooltip, información del usuario, logo, etc.
```

**Guía de decisión**:
- ¿El componente representa una sección completa visible de la página? → `/organisms`
- ¿Combina múltiples grupos de elementos? → `/organisms`
- ¿Tiene funcionalidad propia compleja? → `/organisms`

---

### `/templates` - Templates

**Definición**: Estructuras de diseño sin contenido real. Definen cómo se organizan los organismos en una página.

**Características**:
- Definen layouts y estructuras de página
- No contienen contenido específico real
- Son esquemas de disposición de componentes
- Ejemplos: Layout de dashboard con áreas definidas, Layout de formulario con sidebar, Layout de dos columnas

**Ejemplo conceptual**:
```jsx
// templates/DashboardLayout.jsx
export const DashboardLayout = ({ sidebar, mainContent, header }) => {
  return (
    <div className="grid grid-cols-[250px_1fr]">
      <aside>{sidebar}</aside>
      <main>
        <header>{header}</header>
        {mainContent}
      </main>
    </div>
  )
}
```

**Cuándo usar**:
- Cuando necesites definir la estructura base de múltiples páginas similares
- Cuando quieras separar el layout del contenido específico

---

### `/pages` - Páginas

**Definición**: Instancias específicas con contenido real. Son las páginas completas que el usuario ve.

**Características**:
- Combinan templates (si existen) y organisms
- Contienen contenido específico y funcionalidad de página completa
- Pueden manejar rutas y lógica de página
- Ejemplos: Dashboard, LoginPage, DocumentListPage, SettingsPage

**Ejemplo real en el proyecto**:
```9:41:src/components/pages/Dashboard.jsx
// pages/Dashboard.jsx
// Página completa que combina Navbar (organism) con contenido específico
```

**Guía de decisión**:
- ¿Es una página completa que el usuario navega? → `/pages`
- ¿Contiene la lógica y estado de una vista completa? → `/pages`
- ¿Se renderiza en una ruta específica? → `/pages`

---

### `/ui` - Componentes de shadcn/ui

**Definición**: Componentes base de la librería shadcn/ui. Estos son componentes primitivos reutilizables.

**Características**:
- Componentes instalados desde shadcn/ui
- **NO crear componentes personalizados aquí**
- Mantener la estructura tal como viene de shadcn/ui
- Ejemplos actuales: `avatar.jsx`, `tooltip.jsx`

**Regla importante**:
- ✅ Todos los componentes de shadcn/ui deben estar aquí
- ❌ NO crear componentes personalizados del proyecto aquí
- ❌ NO modificar estos componentes directamente (usar composición o wrapper)

**Antes de crear un componente UI**:
1. Consultar con el Sub-Agente de Estilos (`context/sub-agents/STYLE_AGENT.md`)
2. Verificar si existe en shadcn/ui
3. Si existe, instalarlo en `/ui`
4. Si no existe, crear componente personalizado en el nivel apropiado (atom/molecule/organism)

---

## 🔍 Árbol de Decisión: ¿Dónde Crear un Componente?

Usa este flujo de decisión para ubicar correctamente un nuevo componente:

```
¿Es un componente de shadcn/ui?
├─ SÍ → /ui (instalar con shadcn CLI)
└─ NO → Continúa...

¿Es una página completa con ruta propia?
├─ SÍ → /pages
└─ NO → Continúa...

¿Es una estructura de layout sin contenido específico?
├─ SÍ → /templates
└─ NO → Continúa...

¿Es una sección compleja con múltiples elementos y funcionalidad?
├─ SÍ → /organisms
└─ NO → Continúa...

¿Combina 2-4 componentes básicos?
├─ SÍ → /molecules
└─ NO → Continúa...

¿Es un componente básico sin dependencias de otros componentes personalizados?
└─ SÍ → /atoms
```

---

## 📋 Ejemplos Prácticos por Tipo de Componente

### Ejemplos de Átomos
- `Button.jsx` - Botón personalizado con variantes
- `Badge.jsx` - Badge personalizado para categorías
- `IconButton.jsx` - Botón solo con icono
- `LoadingSpinner.jsx` - Spinner de carga
- `Divider.jsx` - Separador visual

### Ejemplos de Moléculas
- `SearchBar.jsx` - Input + Botón de búsqueda
- `FormField.jsx` - Label + Input + Mensaje de error
- `DocumentCard.jsx` - Card básica con título y descripción
- `StatCard.jsx` - Card con número y etiqueta
- `UserBadge.jsx` - Avatar + Nombre de usuario

### Ejemplos de Organismos
- `Navbar.jsx` - Barra de navegación completa ✅ (ya existe)
- `DocumentList.jsx` - Lista completa de documentos con filtros
- `ChatPanel.jsx` - Panel de chat con input y lista de mensajes
- `StatisticsPanel.jsx` - Panel con múltiples gráficos y estadísticas
- `DocumentUploadForm.jsx` - Formulario completo de subida con validación

### Ejemplos de Templates
- `DashboardTemplate.jsx` - Layout base del dashboard
- `FormLayoutTemplate.jsx` - Layout para páginas de formulario
- `TwoColumnTemplate.jsx` - Layout de dos columnas

### Ejemplos de Páginas
- `Dashboard.jsx` - Página principal del dashboard ✅ (ya existe)
- `LoginPage.jsx` - Página de inicio de sesión
- `DocumentsPage.jsx` - Página de gestión de documentos
- `SettingsPage.jsx` - Página de configuración

---

## ✅ Convenciones y Reglas

### Nomenclatura
- **Archivos**: PascalCase (`ComponentName.jsx`)
- **Exportaciones**: Named exports (`export const ComponentName` o `export function ComponentName`)
- **Archivos de índice**: Opcional, pero si existen, deben exportar todos los componentes de la carpeta

### Imports
- Usar alias `@/components` configurado en `jsconfig.json`
- Ejemplo: `import { Navbar } from '@/components/organisms/Navbar'`
- Para componentes UI: `import { Button } from '@/components/ui/button'`

### Dependencias entre Niveles
- **Regla general**: Los componentes solo pueden importar de su mismo nivel o niveles inferiores
- **✅ Permitido**:
  - `molecules/` puede importar de `atoms/` y `ui/`
  - `organisms/` puede importar de `molecules/`, `atoms/` y `ui/`
  - `pages/` puede importar de todos los niveles
- **❌ NO permitido**:
  - `atoms/` NO debe importar de `molecules/` o `organisms/`
  - `molecules/` NO debe importar de `organisms/`

### Archivos Adicionales
- Si un componente necesita estilos específicos, crear archivo co-located: `ComponentName.module.css`
- Si un componente necesita tipos TypeScript, crear: `ComponentName.types.ts` (si se usa TypeScript)
- Si un componente tiene tests, crear: `ComponentName.test.jsx` (si existe suite de testing)

---

## 🚀 Proceso Recomendado para Crear Nuevo Componente

1. **Identificar el tipo de componente** usando el árbol de decisión
2. **Verificar shadcn/ui**: ¿Existe un componente similar? (Consultar Sub-Agente de Estilos)
3. **Revisar componentes existentes**: ¿Hay algo reutilizable?
4. **Crear el componente** en la carpeta apropiada
5. **Seguir convenciones**: PascalCase, named exports, imports con alias `@/`
6. **Documentar** si el componente tiene props complejas o comportamiento no obvio

---

## 📚 Referencias

- **Documentación Atomic Design**: [Brad Frost - Atomic Design](https://atomicdesign.bradfrost.com/)
- **README local**: Ver `src/components/README.md` para más detalles
- **Sub-Agente de Estilos**: `context/sub-agents/STYLE_AGENT.md` para consultas sobre componentes UI
- **Guía Principal**: `AGENT.md` para contexto general del proyecto

---

## 🤔 Dudas Comunes

**P: ¿Un botón con un icono es un átomo o una molécula?**
R: Depende. Si el icono es parte esencial del botón y no se reutiliza por separado, es un átomo. Si combinas un componente Button existente con un componente Icon, es una molécula.

**P: ¿Un formulario complejo con validación va en molecules u organisms?**
R: Si es un formulario completo con múltiples secciones, lógica compleja y múltiples elementos, va en `/organisms`. Si es un grupo simple de inputs sin mucha complejidad, puede ir en `/molecules`.

**P: ¿Puedo poner un componente en organisms aunque sea simple?**
R: Es mejor empezar simple y moverlo si crece. Si sabes que va a crecer en complejidad, puedes ponerlo directamente en organisms.

**P: ¿Los hooks personalizados van en components?**
R: No, los hooks personalizados van en `src/hooks/`, no en `src/components/`.

---

**Última actualización**: Esta estructura fue implementada siguiendo la metodología Atomic Design y está alineada con las mejores prácticas del proyecto.

