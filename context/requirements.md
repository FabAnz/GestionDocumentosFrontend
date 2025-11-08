# Requerimientos del Proyecto - Plataforma RAG

## 1. Descripción General

Sistema de gestión de conocimiento basado en RAG (Retrieval-Augmented Generation) que permite a los usuarios gestionar documentos, consultar información mediante un chat con asistente de IA, y visualizar estadísticas de consultas. La plataforma cuenta con un sistema de planes (Plus y Premium) que limita o permite documentos ilimitados según el plan del usuario.

---

## 2. Requerimientos Funcionales

### 2.1. Gestión de Usuario

#### RF-001: Autenticación y Perfil de Usuario
- **Descripción**: El sistema debe mostrar información del usuario autenticado en la barra de navegación superior.
- **Datos requeridos**:
  - Nombre del usuario
  - Email del usuario
  - Plan actual (Plus o Premium)
  - Cantidad de documentos almacenados
  - Límite de documentos según el plan
- **Comportamiento**: 
  - El navbar debe incluir un botón de cierre de sesión (aunque la funcionalidad puede estar pendiente de implementación backend)
  - El navbar debe mostrar un logo/identificador de la plataforma

#### RF-002: Sistema de Planes
- **Descripción**: El sistema debe soportar dos tipos de planes con diferentes límites.
- **Planes**:
  - **Plan Plus**: Límite de documentos (ej: 10 documentos)
  - **Plan Premium**: Documentos ilimitados (límite = -1)
- **Funcionalidades**:
  - Mostrar el plan actual del usuario
  - Mostrar contador de documentos usados vs límite (solo para Plan Plus)
  - Mostrar barra de progreso visual del uso de documentos
  - Permitir actualización de plan a Premium desde la interfaz
  - Mostrar mensaje de advertencia cuando se alcanza el límite
  - Mostrar mensaje de confirmación cuando el usuario tiene plan Premium

---

### 2.2. Gestión de Documentos

#### RF-003: Visualización de Documentos
- **Descripción**: El sistema debe mostrar una lista de documentos con información detallada.
- **Información a mostrar por documento**:
  - Título
  - Contenido/preview (máximo 2 líneas con truncado)
  - Categoría (con badge visual)
  - Tipo de documento (texto o imagen)
  - Preview de imagen si es tipo imagen
  - Icono representativo si es texto
  - Fecha de creación/modificación
- **Comportamiento**:
  - Lista debe ser scrollable con altura máxima
  - Mostrar contador total de documentos
  - Mostrar mensaje cuando no hay documentos
  - Diseño responsive que se adapte a diferentes tamaños de pantalla

#### RF-004: Filtrado de Documentos por Categoría
- **Descripción**: El sistema debe permitir filtrar documentos por categoría.
- **Categorías disponibles**:
  - Todas (filtrar todos los documentos)
  - Políticas
  - FAQ
  - Soporte Técnico
  - Ventas
  - Marketing
- **Comportamiento**:
  - Botones de filtro visuales con estado activo/inactivo
  - El filtro activo debe destacarse visualmente
  - Actualizar la lista de documentos al cambiar el filtro
  - Mostrar mensaje específico cuando no hay documentos en la categoría seleccionada

#### RF-005: Agregar Documentos
- **Descripción**: El sistema debe permitir agregar nuevos documentos al conocimiento.
- **Forma de carga**:
  - **Drag and Drop**: Arrastrar y soltar archivos sobre una zona designada
  - **Selección de archivo**: Click para abrir explorador de archivos
- **Tipos de archivo soportados**:
  - Texto: `.txt`, `.pdf`, `.doc`, `.docx`, `.md`
  - Imágenes: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- **Datos requeridos**:
  - Título del documento (campo de texto obligatorio)
  - Categoría (selector dropdown)
  - Archivo (obligatorio)
- **Validaciones**:
  - No permitir agregar documentos si se alcanzó el límite del plan Plus
  - Validar tipo de archivo soportado
  - Validar que el título no esté vacío
  - Validar que se haya seleccionado un archivo
- **Comportamiento**:
  - Panel colapsable/expandible para agregar documentos
  - Preview de imagen si el archivo es una imagen
  - Mostrar nombre y tamaño del archivo seleccionado
  - Deshabilitar funcionalidad cuando se alcanza el límite
  - Mostrar mensaje cuando no se puede agregar más documentos
  - Resetear formulario después de agregar exitosamente

#### RF-006: Editar Documentos
- **Descripción**: El sistema debe permitir editar documentos existentes.
- **Campos editables**:
  - Título
  - Categoría
- **Comportamiento**:
  - Modo de edición inline (edición directa en la lista)
  - Botones de guardar y cancelar
  - Resetear cambios si se cancela la edición
  - Actualizar visualmente el documento después de guardar

#### RF-007: Eliminar Documentos
- **Descripción**: El sistema debe permitir eliminar documentos.
- **Comportamiento**:
  - Confirmación antes de eliminar (diálogo de confirmación)
  - Actualizar contador de documentos después de eliminar
  - Actualizar lista visualmente después de eliminar
  - Actualizar límites y disponibilidad para agregar nuevos documentos

#### RF-008: Límites de Documentos
- **Descripción**: El sistema debe respetar los límites según el plan del usuario.
- **Comportamiento**:
  - Bloquear agregar documentos cuando se alcanza el límite (Plan Plus)
  - Permitir documentos ilimitados cuando el usuario tiene Plan Premium
  - Actualizar estado visual de botones y formularios según disponibilidad
  - Mostrar mensajes informativos sobre límites alcanzados

---

### 2.3. Sistema de Chat con IA

#### RF-009: Interfaz de Chat
- **Descripción**: El sistema debe proporcionar una interfaz de chat para consultar información.
- **Elementos de la interfaz**:
  - Lista de mensajes con scroll automático al final
  - Campo de entrada de texto
  - Botón de envío
  - Indicadores visuales de usuario y asistente
  - Timestamps de mensajes
  - Título del panel de chat
- **Comportamiento**:
  - Auto-scroll al último mensaje
  - Validar que el mensaje no esté vacío antes de enviar
  - Mostrar mensaje de bienvenida inicial del asistente
  - Diferentes estilos visuales para mensajes de usuario y asistente
  - Formato de hora legible (HH:MM)

#### RF-010: Envío y Recepción de Mensajes
- **Descripción**: El sistema debe manejar el envío y recepción de mensajes.
- **Comportamiento**:
  - Al enviar un mensaje del usuario, debe aparecer inmediatamente en el chat
  - El asistente debe responder después de un delay simulado (mockup)
  - Los mensajes deben tener un ID único y timestamp
  - Los mensajes deben persistir durante la sesión
  - Extracción automática de keywords de los mensajes del usuario

#### RF-011: Chat Responsive
- **Descripción**: El chat debe adaptarse a diferentes tamaños de pantalla.
- **Comportamiento Desktop (xl y superior)**:
  - Chat siempre visible en una columna lateral derecha
  - Altura fija con scroll interno
- **Comportamiento Mobile/Tablet (menor a xl)**:
  - Botón flotante en la esquina inferior derecha para abrir chat
  - Chat como drawer/modal que se abre desde la derecha
  - Overlay oscuro de fondo cuando el chat está abierto
  - Botón de cerrar para volver a ocultar el chat
  - Chat oculto por defecto

---

### 2.4. Visualización de Estadísticas

#### RF-012: Gráfico de Temas Más Consultados
- **Descripción**: El sistema debe mostrar un gráfico de barras horizontales con los temas más consultados.
- **Datos a mostrar**:
  - Top 5 keywords/temas más consultados
  - Cantidad de consultas por keyword
- **Comportamiento**:
  - Gráfico de barras horizontales
  - Ordenado por cantidad de consultas (mayor a menor)
  - Mostrar mensaje cuando no hay datos aún
  - Actualización automática basada en consultas del chat
  - Diseño responsive que se adapte al contenedor
  - Colores temáticos consistentes con el diseño

#### RF-013: Extracción de Keywords
- **Descripción**: El sistema debe extraer keywords de los mensajes del usuario para análisis.
- **Keywords a detectar**:
  - políticas
  - faq
  - soporte
  - ventas
  - marketing
  - técnico
  - producto
  - servicio
- **Comportamiento**:
  - Detección case-insensitive
  - Múltiples keywords pueden extraerse de un mismo mensaje
  - Almacenamiento para generar estadísticas

---

### 2.5. Diseño y Experiencia de Usuario

#### RF-014: Diseño Responsive
- **Descripción**: La aplicación debe adaptarse a diferentes tamaños de pantalla.
- **Breakpoints**:
  - **Mobile**: 1 columna (todos los paneles apilados)
  - **Tablet/Desktop (md)**: 2 columnas
  - **Large Desktop (xl)**: 3 columnas (layout completo)
- **Distribución de columnas (xl)**:
  - Columna izquierda: 4 columnas (Plan Status, Query Chart)
  - Columna central: 5 columnas (Add Document, Document List)
  - Columna derecha: 3 columnas (Chat Panel)
- **Comportamiento**:
  - Chat solo visible en pantallas xl+
  - Botón flotante de chat en pantallas menores a xl
  - Paneles deben apilarse verticalmente en móviles
  - Navegación siempre visible en la parte superior

#### RF-015: Sistema de Temas
- **Descripción**: La aplicación debe soportar temas claro y oscuro.
- **Comportamiento**:
  - Variables CSS para ambos temas
  - Colores consistentes usando variables CSS
  - Transiciones suaves entre temas
  - Tema claro por defecto

#### RF-016: Iconografía y Visual
- **Descripción**: La aplicación debe usar iconos consistentes.
- **Iconos requeridos**:
  - Usuario (perfil)
  - Cerrar sesión
  - Subir/Upload
  - Documento/Archivo
  - Imagen
  - Carpeta
  - Editar
  - Eliminar
  - Guardar
  - Cancelar
  - Chat/Mensaje
  - Bot (asistente)
  - Usuario (chat)
  - Enviar
  - Corona (plan premium)
  - Trending/Estadísticas
  - Chevron (expandir/colapsar)
  - Cerrar (X)
- **Librería**: Lucide React

---

## 3. Requerimientos No Funcionales

### 3.1. Tecnologías y Stack

#### RNF-001: Framework y Librerías
- **React**: Versión 18.3.1 o superior
- **TypeScript**: Para tipado estático
- **Vite**: Como bundler y herramienta de desarrollo
- **Tailwind CSS**: Para estilos y diseño responsive
- **Recharts**: Para visualización de gráficos
- **Lucide React**: Para iconos

#### RNF-002: Configuración de Desarrollo
- **Scripts disponibles**:
  - `npm run dev`: Servidor de desarrollo
  - `npm run build`: Build de producción
  - `npm run lint`: Linter de código
  - `npm run preview`: Preview del build de producción
- **Configuración TypeScript**: Modo estricto habilitado
- **ESLint**: Configurado para React y TypeScript

### 3.2. Rendimiento

#### RNF-003: Optimización
- Uso de React hooks (useState, useCallback, useEffect) para optimización
- Componentes funcionales con hooks
- Lazy loading donde sea apropiado
- Scroll virtualizado para listas largas (consideración futura)

### 3.3. Accesibilidad

#### RNF-004: Accesibilidad Web
- Uso de aria-labels en botones sin texto
- Estructura semántica HTML
- Navegación por teclado básica
- Contraste de colores adecuado

### 3.4. Compatibilidad

#### RNF-005: Navegadores
- Compatibilidad con navegadores modernos (Chrome, Firefox, Safari, Edge)
- Soporte para funcionalidades modernas de JavaScript (ES2020+)
- Soporte para drag and drop API

---

## 4. Estructura de Datos

### 4.1. Modelo de Usuario

```typescript
interface User {
  name: string;              // Nombre completo del usuario
  email: string;             // Email del usuario
  plan: 'plus' | 'premium';  // Tipo de plan
  docCount: number;          // Cantidad actual de documentos
  docLimit: number;          // Límite de documentos (-1 para ilimitado)
}
```

### 4.2. Modelo de Documento

```typescript
interface Document {
  id: number;                           // ID único del documento
  title: string;                        // Título del documento
  content: string;                      // Contenido o descripción
  category: string;                     // Categoría del documento
  date: string;                         // Fecha en formato ISO
  type: 'text' | 'image';               // Tipo de documento
  preview?: string;                     // URL o base64 de preview (opcional)
}
```

### 4.3. Modelo de Mensaje de Chat

```typescript
interface ChatMessage {
  id: number;                    // ID único del mensaje
  text: string;                  // Contenido del mensaje
  sender: 'user' | 'assistant';  // Remitente del mensaje
  timestamp: string;             // Fecha/hora en formato ISO
}
```

### 4.4. Modelo de Datos de Consulta

```typescript
interface QueryData {
  keyword: string;  // Palabra clave/tema
  count: number;    // Cantidad de consultas
}
```

---

## 5. Flujos de Usuario Principales

### 5.1. Flujo: Agregar Documento

1. Usuario hace clic en "Agregar Documento" (expandir panel)
2. Usuario arrastra un archivo o hace clic para seleccionar
3. Sistema valida tipo de archivo
4. Si es imagen, se muestra preview
5. Usuario ingresa título del documento
6. Usuario selecciona categoría
7. Usuario hace clic en "Agregar Documento"
8. Sistema valida que no se haya alcanzado el límite
9. Documento se agrega a la lista
10. Contador de documentos se actualiza
11. Panel se colapsa y formulario se resetea

### 5.2. Flujo: Consultar en Chat

1. Usuario hace clic en el chat (o botón flotante en móvil)
2. Usuario ve mensaje de bienvenida del asistente
3. Usuario escribe una pregunta
4. Usuario envía el mensaje
5. Mensaje del usuario aparece inmediatamente
6. Sistema extrae keywords del mensaje
7. Asistente responde después de un delay
8. Keywords se agregan a las estadísticas
9. Gráfico de temas consultados se actualiza

### 5.3. Flujo: Filtrar Documentos

1. Usuario hace clic en un filtro de categoría
2. Sistema filtra documentos según categoría seleccionada
3. Lista de documentos se actualiza
4. Botón de filtro activo se resalta visualmente
5. Contador muestra cantidad de documentos filtrados

### 5.4. Flujo: Editar Documento

1. Usuario hace clic en botón de editar de un documento
2. Documento entra en modo edición inline
3. Usuario modifica título y/o categoría
4. Usuario hace clic en "Guardar" o "Cancelar"
5. Si guarda, cambios se aplican y documento vuelve a modo visualización
6. Si cancela, cambios se descartan y documento vuelve a modo visualización

### 5.5. Flujo: Actualizar Plan

1. Usuario con Plan Plus ve botón "Mejorar Plan"
2. Usuario hace clic en el botón
3. Plan se actualiza a Premium
4. Límite de documentos se establece en ilimitado (-1)
5. Interfaz se actualiza mostrando estado Premium
6. Botones y formularios de agregar documentos se habilitan si estaban bloqueados

---

## 6. Estados y Validaciones

### 6.1. Estados de la Aplicación

- **Estado de carga**: (A implementar si se conecta a backend)
- **Estado de error**: (A implementar si se conecta a backend)
- **Estado de documentos**: Lista, filtros, límites
- **Estado de chat**: Mensajes, keywords
- **Estado de usuario**: Plan, límites, contadores

### 6.2. Validaciones

- **Agregar documento**:
  - Título no vacío
  - Archivo seleccionado
  - Tipo de archivo soportado
  - Límite de documentos no alcanzado (Plan Plus)
- **Editar documento**:
  - Título no vacío
  - Categoría válida
- **Enviar mensaje**:
  - Mensaje no vacío (solo espacios en blanco)

---

## 7. Componentes Principales

### 7.1. Componentes de UI

1. **Navbar**: Barra de navegación superior con información del usuario
2. **PlanStatusPanel**: Panel de estado del plan y límites
3. **QueryChart**: Gráfico de barras con temas más consultados
4. **AddDocumentPanel**: Panel colapsable para agregar documentos
5. **DocumentList**: Lista de documentos con filtros
6. **DocumentItem**: Item individual de documento con acciones
7. **ChatPanel**: Panel de chat con mensajes
8. **FloatingChatButton**: Botón flotante para abrir chat en móviles

### 7.2. Hooks Personalizados

1. **useDocuments**: Gestión de documentos (CRUD, filtros, límites)
2. **useChat**: Gestión de mensajes y extracción de keywords

---

## 8. Consideraciones de Implementación Futura

### 8.1. Backend y API

- Conexión con backend para persistencia de datos
- Autenticación real de usuarios
- API REST o GraphQL para operaciones CRUD
- Integración con servicio de IA para respuestas del chat
- Procesamiento de documentos (OCR, extracción de texto, embeddings)

### 8.2. Funcionalidades Adicionales

- Búsqueda de documentos
- Paginación para listas largas
- Notificaciones
- Historial de conversaciones persistente
- Exportación de documentos
- Compartir documentos
- Versiones de documentos
- Comentarios en documentos
- Etiquetas/tags adicionales
- Filtros avanzados (fecha, tipo, etc.)

### 8.3. Mejoras de UX

- Animaciones y transiciones
- Loading states
- Error boundaries
- Toast notifications
- Confirmaciones más elegantes (modales)
- Tutorial/onboarding para nuevos usuarios
- Modo oscuro toggle en UI

---

## 9. Notas Técnicas

### 9.1. Variables CSS y Temas

El proyecto utiliza un sistema de variables CSS para temas:
- Variables definidas en `index.css`
- Soporte para tema claro y oscuro
- Colores semánticos (primary, secondary, accent, destructive, etc.)
- Border radius configurable

### 9.2. Estructura de Archivos

```
src/
  ├── components/     # Componentes React
  ├── hooks/         # Hooks personalizados
  ├── types/         # Definiciones TypeScript
  ├── App.tsx        # Componente principal
  ├── index.tsx      # Punto de entrada
  └── index.css      # Estilos globales y variables CSS
```

### 9.3. Mock Data

El proyecto actualmente utiliza datos mock para:
- Documentos iniciales (3 documentos de ejemplo)
- Respuestas del chat (simuladas con delay)
- Keywords de consultas (hardcodeadas)
- Datos del usuario (hardcodeados)

Estos deben ser reemplazados por llamadas a API reales en producción.

---

## 10. Requerimientos de Seguridad (Futuro)

- Autenticación segura (JWT, OAuth, etc.)
- Validación de archivos en servidor
- Límites de tamaño de archivo
- Sanitización de inputs
- Protección CSRF
- Rate limiting en API
- Encriptación de datos sensibles

---

**Última actualización**: Basado en análisis del prototipo en `context/prototype`
**Versión del documento**: 1.0

