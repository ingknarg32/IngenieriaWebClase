# 📚 Guía Interactiva Completa — Fundamentos de Programación

Página web interactiva creada para aprender los conceptos esenciales de JavaScript y la manipulación del DOM mediante práctica directa en el navegador.

---

## 🗂️ Estructura del Proyecto

```
guia-interactiva/
├── index.html   → Estructura y contenido de la página
├── style.css    → Diseño visual, animaciones y temas de color
└── script.js    → Lógica interactiva y sistema de Agente DOM
```

---

## 📄 index.html — Estructura de la Página

El archivo HTML define la estructura completa de la guía. Está dividido en las siguientes partes:

### `<head>`
Carga la fuente **Inter** y **Fira Code** desde Google Fonts, y enlaza `style.css`.

### Hero (`<header class="hero">`)
Contiene el título principal `<h1 id="titulo-principal">` y el panel de **Misión Secreta** con tres indicadores de condición (`flag1`, `flag2`, `flag3`). Este panel es clave para el sistema del Agente DOM.

### Secciones de Contenido (`<section class="card">`)
La página tiene **8 secciones** de aprendizaje, cada una con:
- Un **bloque de teoría** con código de ejemplo con sintaxis coloreada (`<pre><code>`)
- Una **zona de práctica interactiva** con inputs, selects y botones

| Sección | ID | Contenido |
|---|---|---|
| 1 | `seccion-variables` | Variables y tipos de datos |
| 2 | `seccion-condicionales` | if / else / operador ternario |
| 3 | `seccion-bucles` | for, while, for...of |
| 4 | `seccion-funciones` | Declaración y arrow functions |
| 5 | `seccion-arrays` | Creación, acceso y métodos |
| 6 | `seccion-objetos` | Propiedades y desestructuración |
| 7 | `seccion-dom` | getElementById, querySelector, style |
| 8 | `seccion-eventos` | addEventListener, tipos de eventos |

### `<canvas id="bg-canvas">`
Elemento invisible en el fondo donde `script.js` dibuja las partículas animadas.

---

## 🎨 style.css — Diseño y Animaciones

### Variables CSS (`:root`)
Define todos los colores, radios y sombras del proyecto como tokens reutilizables:
```css
--accent: #7c3aed;   /* Morado principal */
--accent3: #38bdf8;  /* Azul cielo */
--gold: #FFD700;     /* Dorado de la misión */
```

### Fondo Animado (`.hero::before`)
Un gradiente radial que se mueve lentamente con `@keyframes meshMove`, creando un efecto de malla de luz detrás del título.

### Título con Shimmer (`h1#titulo-principal`)
El título usa `background-clip: text` con un gradiente animado (`@keyframes shimmerText`) que corre de izquierda a derecha infinitamente, dando un efecto brillante al texto.

### Cards con Scroll Reveal (`.card`)
Las tarjetas comienzan invisibles (`opacity: 0`) y se vuelven visibles (`opacity: 1`) cuando entran en el viewport, gracias a la clase `.visible` que agrega el `IntersectionObserver` en `script.js`. Cada card tiene un `transition-delay` escalonado para que aparezcan en cascada.

### Borde Animado en Zona Interactiva (`.interactive-zone::after`)
Al hacer hover sobre una zona de práctica, un borde con gradiente multicolor fluye alrededor del contenedor con `@keyframes borderFlow`.

### Estado Dorado (`h1.activated`)
Cuando se activa el Agente DOM, se aplica la clase `.activated` al `<h1>`, que reemplaza el gradiente de texto por un fondo dorado sólido con pulso luminoso (`@keyframes goldPulse`).

---

## ⚙️ script.js — Lógica e Interactividad

### 1. Estado Global del Agente (líneas 13–16)
```js
let condicion1_cumplida = false;
let condicion2_cumplida = false;
let condicion3_cumplida = false;
let misionActivada      = false;
```
Cuatro **variables booleanas** que rastrean el estado de la misión. La revelación solo ocurre cuando las tres condiciones son `true` y `misionActivada` es `false` (para que solo se active una vez).

---

### 2. Partículas de Fondo — `initParticles()` (líneas 21–88)
Dibuja 120 partículas animadas sobre el `<canvas id="bg-canvas">` usando la API **Canvas 2D**:
- Cada partícula tiene posición, velocidad, color y vida aleatoria
- Cuando una partícula muere o sale del canvas, se reinicia con nuevos valores
- Las partículas cercanas (< 120px) se conectan con líneas semitransparentes
- Se ejecuta en un bucle continuo con `requestAnimationFrame`

---

### 3. Scroll Reveal — `initScrollReveal()` (líneas 91–99)
Usa la API **IntersectionObserver** para detectar cuándo cada `.card` entra en la pantalla al hacer scroll:
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08 });
```
Cuando una card es visible al 8%, se le agrega la clase `visible` que dispara la animación de entrada.

---

### 4. Sistema de Misión — `actualizarBandera()` y `verificarMision()`

**`actualizarBandera(num)`** — Cambia el emoji de 🔴 a ✅ en el indicador correspondiente del panel superior y aplica estilos de "completado".

**`verificarMision()`** — Se llama cada vez que se cumple una condición. Revisa si las tres banderas son `true` y `misionActivada` es `false`. Si se cumple, llama a `activarAgentDOM()` con un delay de 400ms.

---

### 5. Activación del Agente DOM — `activarAgentDOM()` (líneas 117–143)
Es la función principal de la misión. Realiza cuatro acciones:

1. **Modifica el `<h1>`**: Aplica fondo dorado `#FFD700` y texto negro `#000000` usando `element.style.setProperty()`, anulando los estilos del gradiente CSS.
2. **Crea el párrafo secreto**: Usa `document.createElement('p')` e `insertAdjacentElement('afterend', mensaje)` para insertar el mensaje **"🎉 Misión Cumplida: Agente DOM activado."** en verde oscuro `#15803d`.
3. **Resalta el panel de misión**: Aplica borde dorado y sombra al cuadro de misión.
4. **Lanza confeti**: Llama a `launchConfetti()` y hace `window.scrollTo({ top: 0, behavior: 'smooth' })`.

---

### 6. Confeti — `launchConfetti()` (líneas 146–170)
Crea 80 elementos `<div>` con posición fija aleatoria y los anima con `@keyframes cfFall` para que caigan y giren desde la parte superior de la pantalla. Cada elemento se elimina del DOM al terminar su animación.

---

### 7. Secciones Interactivas

#### Sección 1 — Variables *(Condición 1)*
Lee el nombre e tipo del input/select, genera código JavaScript equivalente dinámicamente y lo muestra en un bloque de código. **Al ejecutarse por primera vez, marca `condicion1_cumplida = true`.**

#### Sección 2 — Condicionales
Evalúa una edad con un array de rangos y retorna la categoría con emoji y color correspondiente usando `Array.find()`.

#### Sección 3 — Bucles *(Condición 2)*
Genera la tabla de multiplicar del número ingresado con un bucle `for`. Cada fila incluye una **barra de progreso visual** con ancho proporcional al resultado. **Marca `condicion2_cumplida = true`.**

#### Sección 4 — Funciones
Calcula potencias con `Math.pow(base, exponente)` y muestra el código equivalente con arrow function.

#### Sección 5 — Arrays
Mantiene un arreglo en memoria. Los botones usan `Array.push()` y `Array.pop()` para agregar y eliminar elementos, y re-renderiza los chips visualmente en cada acción.

#### Sección 6 — Objetos
Construye un objeto `persona` con tres propiedades desde inputs y muestra su representación en código con `typeof`.

#### Sección 7 — DOM *(Condición 3)*
Modifica el texto, color y fondo de un elemento de preview en tiempo real usando `element.textContent`, `element.style.color` y `element.style.backgroundColor`. **Marca `condicion3_cumplida = true`.**

#### Sección 8 — Eventos
Registra tres `addEventListener` distintos (`click`, `mouseover`, `keydown`) y agrega entradas al log en tiempo real con timestamp, mostrando el nombre de la tecla o el número de veces que ocurrió el evento.

---

## 🕵️ Misión Secreta — Resumen

Para activar el Agente DOM debes completar estas tres acciones **en cualquier orden**:

| # | Condición | Acción |
|---|---|---|
| 1 | Sección Variables | Escribir nombre + elegir tipo + clic en "Declarar Variable" |
| 2 | Sección Bucles | Escribir un número + clic en "Generar Tabla" |
| 3 | Sección DOM | Escribir texto + clic en "Aplicar Cambios" |

**Resultado:** El `<h1>` cambia a fondo dorado con texto negro, aparece el mensaje secreto en verde, y llueve confeti en pantalla.

---

## 🛠️ Tecnologías Usadas

| Tecnología | Uso |
|---|---|
| HTML5 semántico | Estructura y accesibilidad |
| CSS3 (Variables, Animaciones, Grid) | Diseño y micro-animaciones |
| JavaScript Vanilla (ES6+) | Lógica e interactividad |
| Canvas 2D API | Partículas de fondo |
| IntersectionObserver API | Scroll reveal de cards |
| Google Fonts (Inter, Fira Code) | Tipografía |

---

*Guía creada para la materia de Ingeniería Web · Fundamentos de Programación*