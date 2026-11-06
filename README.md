# Luces del Laboratorio

Luces del Laboratorio es un juego web de puzles inspirado en *Lights Out*. En Classic 3×3, cada toque invierte una luz y las que la rodean en cruz. El objetivo es apagar el tablero completo.

El repositorio de ADÜMÜN contiene la aplicación cliente en React, TypeScript y Vite. Puedes jugar localmente sin una cuenta. Para desarrollo, Mock Service Worker simula las llamadas de red que el cliente hace a la API.

## Empieza aquí

- [Ejecutar el juego en tu equipo](docs/START-HERE.md). Desde instalar Git y Node.js hasta abrir el tablero, jugar y detener el servidor.
- [Comprobar el proyecto y resolver fallos](docs/START-HERE.md#verificar-el-proyecto). Comandos de validación, resultados esperados y diagnóstico.
- [Contribuir al repositorio](AGENTS.md). Convenciones de código, flujo Jira → GitHub Issue → PR y requisitos de revisión.

## Ubica las fuentes

| Si buscas… | Consulta |
| --- | --- |
| Arranque de la aplicación y navegación entre pantallas | [`src/app/main.tsx`](src/app/main.tsx) y [`App.tsx`](src/app/ui/App.tsx) |
| Reglas del juego, sesiones y pantallas de partida | [`src/game/`](src/game/) |
| Interfaz compartida y traducciones | [`src/shared/`](src/shared/) |
| Contrato de la API y simulación de respuestas | [OpenAPI](docs/api-contract.openapi.yaml) y [`src/online/mock/`](src/online/mock/) |
| Scripts, dependencias y versiones instaladas | [`package.json`](package.json) y [`package-lock.json`](package-lock.json) |
| Planificación vigente y criterios de documentación | [Proyecto Jira LAB](https://adumun.atlassian.net/browse/LAB) y [estándar documental ADÜMÜN](https://github.com/adumun/platform-standards/blob/main/engineering/STD-ENG-DOC-001-REPOSITORY-DOCUMENTATION-AND-PUBLISHING-BASELINE.md) (acceso interno) |

El material de [`.planning/`](.planning/README.md) es histórico. Para saber qué funciona hoy, consulta el código, las pruebas y los tickets vigentes.
