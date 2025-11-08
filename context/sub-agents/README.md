# Sub-Agentes del Proyecto

Esta carpeta contiene la documentación de los sub-agentes especializados que trabajan bajo la coordinación del agente orquestador principal.

## Estructura

- **STYLE_AGENT.md**: Sub-agente especializado en estilos, diseño visual, aplicación del estilo Claymorphism y uso de componentes shadcn/ui.

## Uso

El agente orquestador principal (`AGENT.md`) consulta estos sub-agentes cuando necesita conocimientos especializados. Cada sub-agente tiene acceso completo a la carpeta `context/` para entender el contexto funcional de la aplicación.

## Agregar Nuevos Sub-Agentes

Para agregar un nuevo sub-agente:

1. Crea un archivo `[NOMBRE]_AGENT.md` en esta carpeta
2. Documenta claramente el rol, responsabilidades y conocimientos del sub-agente
3. Actualiza `AGENT.md` para incluir la referencia al nuevo sub-agente
4. Asegúrate de que el sub-agente tenga acceso al contexto necesario

