# Ejecutar Luces del Laboratorio en local

Sigue esta guía para abrir el juego por primera vez. La ruta principal usa el servidor de desarrollo de Vite y las respuestas simuladas que vienen con el proyecto. Para este recorrido basta con Git, Node.js, npm y un navegador. La conexión a Internet se usa para clonar el repositorio y descargar dependencias.

[Volver al README](../README.md)

## 1. Prepara las herramientas

1. Instala [Git](https://git-scm.com/install/) con las instrucciones para tu sistema operativo.
2. Descarga [Node.js](https://nodejs.org/en/download) y selecciona una versión **24.x**, la misma línea que usa el repositorio en [GitHub Actions](../.github/workflows/deploy-pages.yml). Instálalo con npm, incluido en los instaladores oficiales.
3. Abre una terminal nueva para que reconozca las herramientas instaladas. En Windows puedes usar **Git Bash**, que se incluye en Git for Windows. En macOS o Linux, usa la aplicación Terminal.
4. Ejecuta estos comandos, una línea a la vez. Si alguno falla, corrige ese paso antes de continuar.

```sh
git --version
node --version
npm --version
```

Git y npm deben mostrar un número de versión. La versión de Node debe comenzar con `v24.`. Abre una terminal nueva después de cambiar la versión de Node y vuelve a comprobarla. Ten a mano un navegador actualizado, como Chrome, Firefox o Edge.

## 2. Descarga el proyecto e instala sus dependencias

En la terminal, ubícate en la carpeta donde quieres guardar el proyecto. Por ejemplo, `cd ~/Documents` si esa carpeta existe en tu equipo. Luego ejecuta los siguientes comandos.

```sh
git clone https://github.com/adumun/lab-lights-web.git
cd lab-lights-web
npm ci
```

El primer comando crea la carpeta `lab-lights-web` con la rama predeterminada `master`. El repositorio es público. Si ya tienes una copia, entra en esa carpeta y ejecuta `npm ci` allí.

Git descarga el código, los activos estáticos y el archivo `package-lock.json`. Con ese archivo, `npm ci` instala las versiones registradas en `node_modules/`. El script `prepare` configura `.githooks/` para que Git ejecute lint y typecheck antes de crear commits. Espera a que termine y reaparezca el prompt de la terminal.

## 3. Inicia el juego

Inicia Vite desde la carpeta `lab-lights-web`.

```sh
npm run dev
```

Cuando Vite muestre `ready`, abre en el navegador la URL que aparece junto a `Local`. En un arranque con el puerto predeterminado libre es **http://localhost:5173/**. Si aparece otro puerto, abre la URL informada por Vite. Mantén abierta la terminal mientras uses el juego.

En esta ruta puedes comenzar con una copia limpia, sin crear un archivo `.env` ni levantar servicios adicionales. El juego se abre desde la URL de Vite.

## 4. Juega una primera partida

1. Espera a que la secuencia de inicio muestre **TOCA PARA CONTINUAR** y haz clic o toca la pantalla.
2. En la portada de **Luces del Laboratorio**, elige **Classic 3×3**. Debes ver nueve salas.
3. Haz clic o toca una sala. Deben cambiar de estado esa sala y sus vecinas inmediatas arriba, abajo, a la izquierda y a la derecha, cuando existan. Las diagonales quedan fuera. Intenta apagar las nueve luces. Si quieres volver al estado inicial, pulsa el icono de pausa y elige **Reiniciar tablero**.
4. Al ganar, aparece **Luces apagadas**. Para comprobar el guardado de una partida verificada y sin ayudas, elige **Registrar iniciales**, selecciona tres letras, pulsa **Grabar resultado** y luego **Ver ranking**. Busca tus iniciales en **Mejores registros**. Si la partida no califica para el ranking, verás un aviso en la pantalla de resultado.

La aplicación guarda datos como partidas y ajustes en el almacenamiento local del navegador. Para volver a consultar tus registros, usa el mismo navegador, perfil y URL, incluido el puerto. Para probar desde cero sin perder datos de tu perfil habitual, abre la URL en otro perfil del navegador.

Para detener Vite, vuelve a su terminal y pulsa **Ctrl+C**. En sesiones posteriores, entra en la carpeta del proyecto y usa el comando de arranque del [paso 3](#3-inicia-el-juego). Repite la instalación si cambió `package-lock.json` o borraste `node_modules/`.

## Verificar el proyecto

Para verificar una copia de trabajo, abre otra terminal en la carpeta del repositorio si quieres mantener el juego abierto. Si tienes GNU Make instalado, ejecuta `make verify`. Si solo tienes Git y Node.js, ejecuta en orden estos cuatro comandos. Son las mismas comprobaciones que coordina [el Makefile](../Makefile).

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

| Comprobación | Resultado esperado |
| --- | --- |
| Lint | ESLint termina sin errores. Revisa los avisos por separado. |
| Tipos | TypeScript termina sin errores de compilación. |
| Pruebas | Vitest informa archivos y pruebas aprobados. Incluye pruebas del tablero y del registro de un resultado. |
| Compilación | Vite genera `dist/index.html` y sus activos en `dist/`. |

Para repetir las pruebas automáticamente al editar archivos, usa `npm run test:watch` y detenlo con **Ctrl+C**.

La compilación genera archivos para servir por HTTP. El build de producción deja la simulación de API desactivada. [package.json](../package.json) contiene la definición de los comandos y [vite.config.ts](../vite.config.ts) configura Vite y Vitest.

## Configuración opcional para probar una API

| Opción | Cuándo usarla |
| --- | --- |
| `VITE_API_URL` | Cuando ya dispones de una API de pruebas compatible. El cliente necesita su URL base completa, incluido el prefijo de la API si corresponde. |
| `BASE_PATH` | Cuando necesitas publicar el frontend bajo una subruta. Es una variable del proceso, leída en [vite.config.ts](../vite.config.ts). La ruta local predeterminada es `/`. El workflow de Pages usa `/lab-lights-web/` para este repositorio. |
| `VITE_APP_NAME` | Aparece en [`.env.example`](../.env.example) como referencia. El código actual no lee esa variable. |

Con el servidor de desarrollo y `VITE_API_URL` sin definir, el cliente usa `/v1`. Mock Service Worker intercepta las rutas simuladas dentro del navegador. Este repositorio contiene el cliente y el [contrato OpenAPI](api-contract.openapi.yaml), que define las operaciones, pero una API real debe estar disponible por separado.

Si trabajas con una API de pruebas, crea `.env.local` junto a `package.json`. Agrega una línea `VITE_API_URL=` seguida de la URL base que te entregó quien opera esa API, sin barra final. Reinicia Vite para aplicar el cambio. Si la API tiene otro origen, debe aceptar mediante CORS la URL desde la que abriste el frontend. Las variables con prefijo `VITE_` llegan al navegador, por lo que deben contener únicamente valores públicos.

Para recuperar el modo simulado, elimina la asignación de `VITE_API_URL` de tu configuración local y, si la habías exportado, de la terminal. Reinicia Vite. Dejar la variable asignada a una cadena vacía puede cambiar la URL que usa el cliente.

## Resolver fallos frecuentes

| Si ocurre esto… | Comprueba esto primero |
| --- | --- |
| La terminal no reconoce `git`, `node` o `npm`. | Reabre la terminal y repite las comprobaciones del paso 1. Si Node sigue mostrando otra versión, selecciona 24.x en el gestor que uses o instala la versión correcta. |
| `git clone` dice que el directorio ya existe. | Si esa carpeta contiene tu copia de `lab-lights-web`, entra en ella. Si contiene otros archivos, elige otra carpeta de destino para conservarlos. |
| `npm ci` informa que falta `package.json` o `package-lock.json`. | Ejecuta `git status` y confirma que la terminal está dentro del repositorio. Ambos archivos deben estar en la carpeta desde la que ejecutas npm. |
| `npm ci` falla al descargar dependencias. | Comprueba tu conexión y el registro configurado con `npm config get registry`. Si el error indica que el lockfile no coincide con el manifiesto, comprueba la rama y tus cambios con `git status` y `git diff -- package.json package-lock.json`. Conserva el lockfile y comparte el primer error si persiste. |
| El navegador dice que la conexión fue rechazada. | Confirma que Vite sigue activo y que copiaste la URL de `Local`. Si abriste `index.html` como archivo, cierra esa pestaña y entra por la URL de Vite. |
| Ves una página en blanco o falla el arranque de la simulación. | Confirma que estás usando `localhost` y abre `mockServiceWorker.js` bajo la misma URL para comprobar que Vite lo sirve. Abre las herramientas de desarrollo del navegador (F12 o desde el menú), revisa **Consola** y **Red**, y guarda el primer error. Un navegador con políticas que impiden Service Workers puede requerir otro perfil o navegador. |
| El juego abre, pero las llamadas a la API fallan. | Comprueba si configuraste `VITE_API_URL`. Con API externa, revisa la base, la respuesta de la API y CORS en **Red**. Para probar con mocks, sigue el paso para recuperar el modo simulado. |
| El ranking parece vacío tras reiniciar. | Comprueba que usas el mismo perfil y el mismo origen (esquema, host y puerto). Revisa también si el navegador eliminó el almacenamiento local. |

Para compartir un problema, adjunta el comando que ejecutaste, el primer error relevante, tu versión de Node y el commit que devuelve `git rev-parse --short HEAD`. Si el problema ocurre en el navegador, incluye la URL local y el paso de la partida. Omite credenciales, tokens y datos personales.
