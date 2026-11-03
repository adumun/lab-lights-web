# Guía de contribución — Luces del Laboratorio

## Aplicación y estructura actual

Este repositorio contiene una aplicación web ejecutable con React 19, TypeScript estricto y Vite 7. Utiliza Tailwind CSS, Anime.js e i18next. Lee primero [package.json](package.json) y el código del área asignada; una especificación histórica no demuestra que una funcionalidad esté implementada.

- [src/app/](src/app/) contiene el arranque (`main.tsx`), estilos y composición de pantallas.
- [src/game/](src/game/) contiene reglas, sesiones, persistencia y UI del juego.
- `src/profile/`, `src/rankings/`, `src/settings/`, `src/economy/`, `src/progression/`, `src/achievements/`, `src/liveops/` y `src/social/` contienen las demás áreas del producto.
- [src/shared/](src/shared/) contiene UI reutilizable, traducciones, movimiento y utilidades compartidas. El encabezado común está en [ScreenHeader.tsx](src/shared/ui/components/ScreenHeader.tsx).
- [src/online/](src/online/) contiene contratos cliente, servicios, transporte y mocks MSW. [docs/api-contract.openapi.yaml](docs/api-contract.openapi.yaml) describe el contrato API; este repositorio no incluye un servidor backend real.
- Las pruebas `*.test.ts` están junto al código; [vite.config.ts](vite.config.ts) configura Vitest con jsdom y [vitest.setup.ts](vitest.setup.ts) carga sus extensiones. Playwright y una suite e2e no están configurados.
- [public/](public/) contiene activos estáticos, incluido el worker generado de MSW.

## Instalación y desarrollo

Usa Git, Node.js 24 y npm, alineados con [CI](.github/workflows/deploy-pages.yml). Desde una copia nueva:

```sh
git clone https://github.com/adumun/lab-lights-web.git
cd lab-lights-web
npm ci
npm run dev
```

Abre la URL local que informe Vite. `npm ci` utiliza `package-lock.json`; su script `prepare` configura los hooks de Git en `.githooks/`. El hook de pre-commit ejecuta lint y typecheck; no reemplaza las demás verificaciones.

No se requieren credenciales ni `.env` para el desarrollo con mocks. [.env.example](.env.example) contiene `VITE_APP_NAME`. En desarrollo, si `VITE_API_URL` no está definido, [src/app/main.tsx](src/app/main.tsx) inicia MSW para interceptar las llamadas a `/v1`. Para trabajar con un backend real, configura su URL base en `VITE_API_URL` dentro de `.env.local` y reinicia Vite. Las variables `VITE_*` son públicas en el navegador: nunca contienen secretos. El build de producción no inicia MSW; sus funciones online requieren una API disponible. `BASE_PATH` configura la base de Vite; CI usa `/lab-lights-web/` para GitHub Pages.

## Comandos efectivos y verificación

| Comando | Resultado |
| --- | --- |
| `npm ci` | Instala las dependencias fijadas y configura los hooks. |
| `npm run dev` | Inicia el servidor de desarrollo Vite. |
| `npm run lint` | Ejecuta ESLint sobre el repositorio. |
| `npm run typecheck` | Ejecuta `tsc -b --pretty false`. |
| `npm run test` | Ejecuta Vitest una vez. |
| `npm run test:watch` | Ejecuta Vitest en modo interactivo. |
| `npm run build` | Comprueba TypeScript y genera el build Vite en `dist/`. |
| `make verify` | Ejecuta lint, typecheck, test y build localmente, deteniéndose ante el primer fallo. |
| `make create-pr` | Verifica el cambio, publica la rama configurada y prepara un PR borrador mediante GitHub CLI. |

Antes de presentar un cambio ejecuta lint, typecheck, test y build, como CI. Para una contribución pequeña, comprueba también el comportamiento afectado y registra comandos, resultados y limitaciones reales en el PR. Los cambios documentales requieren revisar rutas, enlaces y coherencia con los scripts; no agregues pruebas que solo reproduzcan el texto. Un fallo existente se registra y se vincula a su Jira correspondiente; no se corrige fuera del alcance autorizado.


Para presentar un PR desde una rama autorizada instala **GNU Make** y [GitHub CLI](https://cli.github.com/), autentícate con `gh auth login` y comprueba que el árbol Git esté limpio. Usa el nombre `<tipo>/<JIRA-KEY>-gh<N>-<slug>` con el Issue GitHub real; ejecuta `make create-pr`. Este comando exige referencia Jira/Issue en el último commit, valida localmente con `make verify`, publica sin force push y abre un editor para completar un **PR borrador** dirigido a `master`. Si trabajas en un fork, configúralo como remoto Git y utiliza `PR_REMOTE=fork make create-pr` (sustituye `fork` por el nombre configurado). Si el comando falla, corrige el problema y vuelve a ejecutarlo; una validación local no es un check alojado ni reemplaza la aprobación del mentor. En Windows, instala GNU Make además de Node.js 24 y GitHub CLI.

## Autoridad y flujo de trabajo

La autoridad corporativa es [STD-ENG-WFM-001](https://github.com/adumun/platform-standards/blob/main/engineering/STD-ENG-WFM-001-WORK-PLANNING-AND-TRACEABILITY-STANDARD.md). Consulta su versión vigente antes de ejecutar.

1. **Jira LAB** autoriza el resultado, prioridad, alcance, aceptación, dependencias y responsable. Sin Jira autorizado y Definition of Ready satisfecha no comienza trabajo material. Cada conversación tiene un Jira principal; un hallazgo independiente se registra o reutiliza en otro Jira relacionado y se aborda en otra conversación.
2. **Preflight:** declara todos los repositorios necesarios para el slice (incluidas dependencias normativas o contractuales), revisa sus Issues, ramas y PR abiertos y registra evidencia actual. Cualquier PR abierto en ese conjunto bloquea nueva implementación hasta que su responsable lo integre o cierre explícitamente. Los resultados válidos son `PASS`, `BLOCKED_BY_OPEN_PR` y `BLOCKED_BY_DEPENDENCY_STATE`.
3. **GitHub Issue:** reutiliza o crea el slice técnico del repositorio con `Parent Jira`, archivos/componentes, restricciones, aceptación local, conjunto de repositorios, preflight y validaciones. No copies el ciclo de planificación de Jira.
4. **Rama y commits:** parte de la base de integración confirmada (la rama predeterminada actual es `master`; no asumas que `develop` está actualizada). Usa `<tipo>/<JIRA-KEY>-gh<N>-<slug>` y commits Conventional Commits con `refs #<N> <JIRA-KEY>`. Sustituye los marcadores por identificadores reales y conserva la clave Jira en mayúsculas. Los commits intermedios no cierran el Issue.
5. **Pull Request:** título con la clave Jira, enlace al Issue y Jira, preflight, alcance/exclusiones, validaciones, compatibilidad y pendientes. Usa `Closes #<N>` solo si completa ese Issue. Añade capturas si cambia la UI. La revisión decide integración o cierre explícito; abrir un PR no completa Jira.
6. **Evidencia:** registra PR, commit, resultados y pendientes en Jira. Cierra solo tras satisfacer su aceptación y contar con evidencia integrada; no supongas que los enlaces o commits cambian estados automáticamente.

Para empezar como trainee: confirma con tu mentor el ticket, acceso, base y persona revisora; instala, verifica el baseline y lee el componente asignado con sus pruebas antes de modificarlo. Mantén una sola contribución acotada y comunica cualquier bloqueo con su salida reproducible.

## Estilo y límites de edición

Mantén TypeScript estricto y la organización existente por `domain`, `application`, `infra` y `ui` donde corresponda. Las reglas de negocio quedan fuera de los componentes React; reutiliza la UI compartida y las traducciones existentes. Prioriza pruebas de comportamiento de reglas y servicios; para componentes utiliza Testing Library cuando corresponda, sin asumir una suite e2e inexistente.

No edites `.idea/`, dependencias ni archivos generados como `dist/` o `public/mockServiceWorker.js` a mano. Conserva la ortografía española, incluidas tildes, `ñ` y signos de apertura.

## Fuentes históricas: solo consulta

[.planning/](.planning/README.md) es **legado histórico / solo lectura**, procedente del antiguo plugin Claude Planning y anterior a Shipping Mode. Sus índices, estados «activos», reglas, bypasses y workflows son evidencia histórica, no instrucciones vigentes ni planificación operativa. No los repares, migres, sincronices ni elimines como parte de trabajo ordinario; cualquier limpieza requiere una decisión y un Jira separados. Este aviso de clasificación no reactiva su sistema.

[.raw/](.raw/) conserva especificaciones y procedencia del diseño: sirve como contexto, no sustituye Jira ni prueba el estado del código. No crees documentos paralelos ni actualices índices históricos para autorizar trabajo nuevo.

Shipping Mode es una herramienta opcional de ejecución gobernada en Claude Code, no una dependencia de Jira/GitHub. No se afirma su instalación en LAB: no están presentes `.planning/plugin.lock.yml` ni `.planning/config.yml`. El flujo Jira → GitHub Issue → PR se utiliza con independencia de esa herramienta.
