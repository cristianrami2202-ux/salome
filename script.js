// ===== Mensajes del oso (puedes editarlos a tu gusto) =====
const NOMBRE = "Salomé";
const MENSAJES = [
  `¡Hola, ${NOMBRE}! 🐻 Soy el osito mensajero y vengo con una carta muy especial.`,
  "Alguien quiso que hoy sonrieras un poquito más de lo normal. 😊",
  `${NOMBRE}, tu sonrisa es de esas que cambian el día de cualquiera.`,
  "Gracias por ser tan especial. Se nota en cómo haces sentir bien a los demás. 💖",
  "Recuerda: eres capaz de cosas increíbles, aunque a veces no lo veas.",
  "Si hoy fue un día pesado, aquí tienes un abrazo de oso. ¡Es el mejor del mundo! 🤗",
  `Eso es todo por ahora, ${NOMBRE}. Pero puedes tocarme las veces que quieras. 💕`
];

// ===== Elementos =====
const $ = (id) => document.getElementById(id);
const sobre = $("sobre");
const escenaCarta = $("escena-carta");
const escenaOso = $("escena-oso");
const texto = $("texto");
const oso = $("oso");
const btnSig = $("btn-siguiente");
const btnAbrazo = $("btn-abrazo");
const hint = $("hint");

let indice = 0;
let escribiendo = null;

// ===== Corazones de fondo =====
const EMOJIS = ["❤️", "💖", "💕", "💗", "💘", "🌸"];
function nuevoCorazon() {
  const c = document.createElement("span");
  c.className = "corazon";
  c.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  c.style.left = Math.random() * 100 + "vw";
  c.style.fontSize = 14 + Math.random() * 30 + "px";
  c.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
  c.style.setProperty("--rot", (Math.random() * 60 - 30) + "deg");
  const dur = 5 + Math.random() * 6;
  c.style.animationDuration = dur + "s";
  $("corazones").appendChild(c);
  setTimeout(() => c.remove(), dur * 1000);
}
for (let i = 0; i < 18; i++) setTimeout(nuevoCorazon, i * 180);
setInterval(nuevoCorazon, 380);

// ===== Explosión de corazones en un punto =====
function explosion(x, y, cantidad = 14) {
  for (let i = 0; i < cantidad; i++) {
    const h = document.createElement("span");
    h.className = "explosion";
    h.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const ang = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 110;
    h.style.left = x + "px";
    h.style.top = y + "px";
    h.style.fontSize = 16 + Math.random() * 18 + "px";
    h.style.setProperty("--x", Math.cos(ang) * dist + "px");
    h.style.setProperty("--y", Math.sin(ang) * dist - 30 + "px");
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 950);
  }
}

// ===== Máquina de escribir =====
function escribir(msg) {
  clearInterval(escribiendo);
  texto.textContent = "";
  let i = 0;
  escribiendo = setInterval(() => {
    texto.textContent += msg[i++];
    if (i >= msg.length) clearInterval(escribiendo);
  }, 32);
}

// ===== Abrir la carta =====
sobre.addEventListener("click", (e) => {
  if (sobre.classList.contains("abierto")) return;
  sobre.classList.add("abierto");
  explosion(e.clientX, e.clientY, 22);
  setTimeout(() => {
    escenaCarta.classList.remove("activa");
    escenaOso.classList.add("activa");
    escribir(MENSAJES[0]);
    oso.classList.add("salta");
    setTimeout(() => oso.classList.remove("salta"), 700);
  }, 1700);
});

// ===== Siguiente mensaje =====
function siguiente() {
  indice = (indice + 1) % MENSAJES.length;
  escribir(MENSAJES[indice]);
  btnSig.textContent = indice === MENSAJES.length - 1 ? "Otra vez 🔁" : "Siguiente 💕";
  saltar();
}
btnSig.addEventListener("click", (e) => {
  const r = e.target.getBoundingClientRect();
  explosion(r.left + r.width / 2, r.top, 8);
  siguiente();
});

// ===== Acciones del oso =====
function saltar() {
  oso.classList.remove("salta", "abrazo");
  void oso.getBoundingClientRect();
  oso.classList.add("salta");
}
function abrazar() {
  oso.classList.remove("salta", "abrazo");
  void oso.getBoundingClientRect();
  oso.classList.add("abrazo");
  const r = oso.getBoundingClientRect();
  explosion(r.left + r.width / 2, r.top + r.height / 2, 24);
  escribir("¡Abrazo de oso! 🤗💞 Eso se siente muy bien, ¿verdad, " + NOMBRE + "?");
}
btnAbrazo.addEventListener("click", abrazar);

let toques = 0;
oso.addEventListener("click", (e) => {
  toques++;
  explosion(e.clientX, e.clientY, 10);
  saltar();
  hint.textContent = "¡Cosquillas! 🐻 (" + toques + ")";
  if (toques === 5) escribir("¡Jajaja, me haces cosquillas, " + NOMBRE + "! 😆");
  if (toques === 10) escribir("Ok, ok... eres la persona más cariñosa que conozco. 💘");
  if (toques === 20) escribir("¡20 toques! Eso merece un abrazo gigante. 🤗");
  if (toques === 20) abrazar();
});

// ===== Ojos que siguen al mouse / dedo =====
const pIzq = $("pupila-izq"), pDer = $("pupila-der");
const bIzq = $("brillo-izq"), bDer = $("brillo-der");
const cabeza = $("cabeza");

function mirar(px, py) {
  const r = oso.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height * 0.35;
  const dx = px - cx, dy = py - cy;
  const d = Math.hypot(dx, dy) || 1;
  const m = Math.min(5, d / 40);
  const ox = (dx / d) * m, oy = (dy / d) * m;
  pIzq.setAttribute("cx", 118 + ox); pIzq.setAttribute("cy", 104 + oy);
  pDer.setAttribute("cx", 182 + ox); pDer.setAttribute("cy", 104 + oy);
  bIzq.setAttribute("cx", 121 + ox); bIzq.setAttribute("cy", 101 + oy);
  bDer.setAttribute("cx", 185 + ox); bDer.setAttribute("cy", 101 + oy);
  const giro = Math.max(-8, Math.min(8, dx / 40));
  cabeza.style.transform = "rotate(" + giro + "deg)";
}
window.addEventListener("mousemove", (e) => mirar(e.clientX, e.clientY));
window.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  mirar(t.clientX, t.clientY);
}, { passive: true });

// ===== Parpadeo =====
const parpados = [$("parpado-izq"), $("parpado-der")];
function parpadear() {
  parpados.forEach((p) => p.classList.add("cierra"));
  setTimeout(() => parpados.forEach((p) => p.classList.remove("cierra")), 140);
  setTimeout(parpadear, 2000 + Math.random() * 3000);
}
setTimeout(parpadear, 2500);

// ===== Corazones al hacer clic en cualquier parte de la escena del oso =====
escenaOso.addEventListener("click", (e) => {
  if (e.target === escenaOso) explosion(e.clientX, e.clientY, 8);
});
