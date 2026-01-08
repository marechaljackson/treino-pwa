/* =========================================================
   Mini App Treino OFFLINE
   - Sem frameworks
   - 100% offline (localStorage)
   - Navegação por dias
   - Concluído por dia
   - Estrutura de exercícios editável por dia
   ========================================================= */

/**
 * Chaves de storage (namespace simples)
 */
const STORAGE_KEY = "treino_offline_v1";

/**
 * Estrutura padrão (base) — conforme conteúdo fornecido no PDF.
 * Observação: o PDF traz múltiplas variações do A–F (vermelho/amarelo/verde).
 * Aqui usamos uma versão "base" A–F (páginas 4–9 do PDF extraído).
 * Você pode editar tudo no app (botão Editar).
 */
const DEFAULT_DATA = {
  meta: {
    title: "Treino OFFLINE",
    version: 1
  },
  days: [
    { key: "seg", label: "Seg", name: "Segunda", workoutKey: "A", muscle: "Dorsal + Bíceps" },
    { key: "ter", label: "Ter", name: "Terça",   workoutKey: "B", muscle: "Peito + Ombro + Tríceps" },
    { key: "qua", label: "Qua", name: "Quarta",  workoutKey: "C", muscle: "Quadríceps" },
    { key: "qui", label: "Qui", name: "Quinta",  workoutKey: "D", muscle: "Ombros" },
    { key: "sex", label: "Sex", name: "Sexta",   workoutKey: "E", muscle: "Bíceps + Tríceps" },
    { key: "sab", label: "Sáb", name: "Sábado",  workoutKey: "F", muscle: "Posteriores + Glúteos" },
    { key: "dom", label: "Dom", name: "Domingo", workoutKey: "OFF", muscle: "Off" }
  ],

  // Marcação de concluído por dia (true/false)
  done: {
    seg: false, ter: false, qua: false, qui: false, sex: false, sab: false, dom: false
  },

  // Treinos A–F (editáveis)
  workouts: {
    A: [
      { name: "Pulley c/ triângulo", sets: "5", reps: "2×12; 1×10; 2×6–8 (pesadas)", rest: "1–2 min" },
      { name: "Remada curvada (pegada pronada)", sets: "5", reps: "1×12 (aquec.); 2×10–12; 2×6–8 (pesadas) — carga progressiva", rest: "1–3 min" },
      { name: "Remada unilateral c/ halter (ou na barra)", sets: "4", reps: "2×10–12; 2×6–8 (pesada)", rest: "1–2 min" },
      { name: "Remada baixa", sets: "3", reps: "1×10–12; 2×8–10 (pesada)", rest: "1–2 min" },
      { name: "Rosca direta na barra W", sets: "4", reps: "2×10–12; 2×6–8 (pesada)", rest: "1 min" },
      { name: "Rosca c/ halteres no banco inclinado", sets: "4", reps: "2×12–15; 2×10", rest: "1 min" },
      { name: "Martelo c/ halter", sets: "3", reps: "12–10–8 (carga progressiva)", rest: "1 min" }
    ],
    B: [
      { name: "Supino inclinado c/ halteres (ou na barra)", sets: "5", reps: "1×15 (aquec.); 2×10; 2×6–8 — carga progressiva", rest: "1–3 min" },
      { name: "Supino reto c/ halteres", sets: "5", reps: "1×15 (aquec.); 2×10; 2×6–8 — carga progressiva", rest: "1–2 min" },
      { name: "Peck deck", sets: "4", reps: "2×10–12; 2×6–10 (pesada)", rest: "1–2 min" },
      { name: "Cross over", sets: "4", reps: "1×12–15; 2×8–12 — cargas progressivas", rest: "1–2 min" },
      { name: "Elevação lateral", sets: "5", reps: "2×15; 2×10–12; 1×8–10 (pesada)", rest: "1–2 min" },
      { name: "Tríceps testa no cross c/ corda", sets: "4", reps: "2×12; 2×8–10", rest: "1 min" },
      { name: "Tríceps na barra V", sets: "4", reps: "2×12; 2×8–10", rest: "1 min" },
      { name: "Abdominal no cross (ou máquina)", sets: "5", reps: "15", rest: "1 min" }
    ],
    C: [
      { name: "Cadeira extensora", sets: "6", reps: "1×20 (aquec.); 3×8–10 (subindo carga); 2×pesadas até a falha", rest: "1–2 min" },
      { name: "Agachamento hack (ou barra guiada)", sets: "5", reps: "1×15 (aquec.); 2×10 (carga moderada); 2×8 (pesadas)", rest: "1–3 min" },
      { name: "Leg press 45º", sets: "5", reps: "1×15 (aquec.); 2×10–12; 2×8–10 (pesadas)", rest: "1–3 min" },
      { name: "Mesa flexora", sets: "4", reps: "12–12–8–8 (carga progressiva)", rest: "1–2 min" },
      { name: "Passada c/ halter", sets: "3", reps: "24", rest: "1–2 min" },
      { name: "Abdutora", sets: "4", reps: "15", rest: "1 min" },
      { name: "Panturrilha em pé na máquina", sets: "5", reps: "8–12", rest: "1 min" }
    ],
    D: [
      { name: "Aquecer manguito no cross", sets: "2", reps: "12", rest: "—" },
      { name: "Desenvolvimento na máquina", sets: "5", reps: "1×15 (aquec.); 2×10; 2×6–8 (pesado)", rest: "1–3 min" },
      { name: "Elevação frontal no cross c/ corda", sets: "3", reps: "2×10–12; 1×6–8 — carga progressiva", rest: "1–3 min" },
      { name: "Elevação lateral", sets: "5", reps: "15–12–10–8–8 (carga progressiva)", rest: "1–2 min" },
      { name: "Elevação lateral no cross", sets: "3", reps: "8–12", rest: "1–2 min" },
      { name: "Crucifixo invertido (peito no banco)", sets: "4", reps: "15–12–10–10 (carga progressiva)", rest: "1–2 min" },
      { name: "Encolhimento na barra guiada", sets: "4", reps: "8–10 (carga progressiva)", rest: "1 min" },
      { name: "Supino inclinado na barra (ou Smith)", sets: "4", reps: "15–15–12–12", rest: "1 min" },
      { name: "Peck deck (fechado)", sets: "3", reps: "15 (2s no pico de contração)", rest: "1 min" }
    ],
    E: [
      { name: "Rosca direta (barra) no cross", sets: "5", reps: "1×20; 3×10–8–8 (carga progressiva); 1×6–10 (pesada)", rest: "1–2 min" },
      { name: "Rosca scoot", sets: "5", reps: "2×10–12; 2×8–10; 1×6–10", rest: "1–2 min" },
      { name: "Rosca martelo c/ halter", sets: "4", reps: "2×12–15; 2×6–10 (carga progressiva)", rest: "1–2 min" },
      { name: "Tríceps testa na corda", sets: "5", reps: "1×20 (aquec.); 2×10–12; 2×6–10 (pesado)", rest: "1–2 min" },
      { name: "Tríceps na barra V", sets: "5", reps: "2×10–12; 2×8–10; 1×6–10 (carga progressiva)", rest: "1–2 min" },
      { name: "Tríceps francesa no cross c/ corda", sets: "4", reps: "2×10–12; 2×6–10 (carga progressiva)", rest: "1–2 min" },
      { name: "Rosca invertida no cross", sets: "3", reps: "15", rest: "1 min" },
      { name: "Abdominal infra", sets: "5", reps: "5", rest: "1 min" },
      { name: "Peck deck voador", sets: "4", reps: "Até a falha", rest: "1 min" }
    ],
    F: [
      { name: "Mesa flexora", sets: "5", reps: "1×20 (aquec.); 3×8–10 (subindo carga); 1×pesada até a falha", rest: "1–2 min" },
      { name: "Cadeira flexora", sets: "4", reps: "1×15 (aquec.); 2×10 (carga moderada); 1×8 (pesada)", rest: "1–2 min" },
      { name: "Stiff", sets: "4", reps: "15–12–10–10", rest: "1–2 min" },
      { name: "Leg press 45º", sets: "4", reps: "20", rest: "1 min" },
      { name: "Abdutora", sets: "5", reps: "12–15", rest: "1 min" },
      { name: "Panturrilha em pé na máquina", sets: "5", reps: "8–12", rest: "1 min" },
      { name: "Observação", sets: "—", reps: "TREINO TÉCNICO.", rest: "—" }
    ]
  },

  // Dia selecionado (persistido)
  selectedDayKey: "seg"
};

/**
 * Estado em memória (carregado do localStorage ou default)
 */
let state = loadState();

/* ---------------------------
   Elementos DOM
---------------------------- */
const dayTabsEl = document.getElementById("dayTabs");
const dayHeroEl = document.getElementById("dayHero");

const workoutTitleEl = document.getElementById("workoutTitle");
const workoutTbodyEl = document.getElementById("workoutTbody");

const doneToggleEl = document.getElementById("doneToggle");

const btnEditEl = document.getElementById("btnEdit");
const btnSaveEl = document.getElementById("btnSave");
const btnCancelEl = document.getElementById("btnCancel");
const btnResetAllEl = document.getElementById("btnResetAll");

const tableWrapEl = document.getElementById("tableWrap");
const editorWrapEl = document.getElementById("editor");
const editorTextareaEl = document.getElementById("editorTextarea");

let isEditing = false;
let editorSnapshot = ""; // para cancelar

/* ---------------------------
   Inicialização
---------------------------- */
renderDayTabs();
renderCurrentDay();

/* ---------------------------
   Eventos
---------------------------- */
btnEditEl.addEventListener("click", () => {
  if (isEditing) return;
  enterEditMode();
});

btnCancelEl.addEventListener("click", () => {
  if (!isEditing) return;
  exitEditMode(false);
});

btnSaveEl.addEventListener("click", () => {
  if (!isEditing) return;
  saveEdits();
});

doneToggleEl.addEventListener("change", () => {
  const dayKey = state.selectedDayKey;
  state.done[dayKey] = !!doneToggleEl.checked;
  persist();
  renderHero(); // atualiza badge
});

btnResetAllEl.addEventListener("click", () => {
  const ok = confirm("Isso vai apagar TODAS as marcações e TODAS as edições. Deseja continuar?");
  if (!ok) return;
  localStorage.removeItem(STORAGE_KEY);
  state = loadState(true);
  isEditing = false;
  renderDayTabs();
  renderCurrentDay();
});

/* =========================================================
   Render
   ========================================================= */

function renderDayTabs() {
  dayTabsEl.innerHTML = "";

  state.days.forEach((d) => {
    const btn = document.createElement("button");
    btn.className = "tab";
    btn.type = "button";
    btn.setAttribute("aria-selected", String(d.key === state.selectedDayKey));

    btn.innerHTML = `
      ${escapeHtml(d.label)}
      <small>${escapeHtml(d.workoutKey === "OFF" ? "OFF" : `Treino ${d.workoutKey}`)}</small>
    `;

    btn.addEventListener("click", () => {
      // sair da edição ao trocar de dia
      if (isEditing) exitEditMode(false);

      state.selectedDayKey = d.key;
      persist();
      renderDayTabs();
      renderCurrentDay();
    });

    dayTabsEl.appendChild(btn);
  });
}

function renderCurrentDay() {
  renderHero();
  renderWorkoutCard();
}

function renderHero() {
  const day = getSelectedDay();
  const done = !!state.done[day.key];

  const title = `${day.name} • ${day.workoutKey === "OFF" ? "OFF" : `Treino ${day.workoutKey}`}`;
  const subtitle = day.workoutKey === "OFF"
    ? "Dia de descanso (Off). Cardio ainda é fixo se você quiser manter rotina."
    : day.muscle;

  const badgeClass = day.workoutKey === "OFF" ? "off" : (done ? "ok" : "");
  const badgeText = day.workoutKey === "OFF"
    ? "Descanso"
    : (done ? "Concluído" : "Pendente");

  dayHeroEl.innerHTML = `
    <div class="hero-grid">
      <div class="hero-row">
        <div>
          <h2 style="margin:0">${escapeHtml(title)}</h2>
          <p class="muted" style="margin:6px 0 0">${escapeHtml(subtitle)}</p>
        </div>
        <span class="badge ${badgeClass}">${escapeHtml(badgeText)}</span>
      </div>
      <p class="muted small" style="margin:0">
        Você pode editar o treino do dia e salvar no aparelho.
      </p>
    </div>
  `;
}

function renderWorkoutCard() {
  const day = getSelectedDay();

  // OFF day: sem musculação (mas mantém card com mensagem)
  if (day.workoutKey === "OFF") {
    workoutTitleEl.textContent = "Musculação (Off)";
    doneToggleEl.checked = !!state.done[day.key];
    doneToggleEl.disabled = false;

    workoutTbodyEl.innerHTML = `
      <tr>
        <td colspan="4">
          <strong>Off Day</strong><br/>
          <span class="muted">Sem musculação programada para hoje.</span>
        </td>
      </tr>
    `;

    // edição desativada no OFF (mas você pode mudar isso se quiser)
    btnEditEl.disabled = true;
    btnSaveEl.disabled = true;
    btnCancelEl.disabled = true;
    tableWrapEl.classList.remove("hidden");
    editorWrapEl.classList.add("hidden");
    isEditing = false;
    return;
  }

  // Dia com treino A–F
  btnEditEl.disabled = false;

  workoutTitleEl.textContent = `Musculação — Treino ${day.workoutKey} (${day.muscle})`;
  doneToggleEl.checked = !!state.done[day.key];
  doneToggleEl.disabled = false;

  const items = state.workouts[day.workoutKey] || [];
  workoutTbodyEl.innerHTML = items.map((it) => {
    return `
      <tr>
        <td>${escapeHtml(it.name)}</td>
        <td>${escapeHtml(it.sets)}</td>
        <td>${escapeHtml(it.reps)}</td>
        <td>${escapeHtml(it.rest)}</td>
      </tr>
    `;
  }).join("");
}

/* =========================================================
   Edição
   ========================================================= */

function enterEditMode() {
  const day = getSelectedDay();
  if (day.workoutKey === "OFF") return;

  isEditing = true;
  btnEditEl.disabled = true;
  btnSaveEl.disabled = false;
  btnCancelEl.disabled = false;

  tableWrapEl.classList.add("hidden");
  editorWrapEl.classList.remove("hidden");

  // carrega JSON no textarea (bonito/legível)
  const current = state.workouts[day.workoutKey] || [];
  const json = JSON.stringify(current, null, 2);

  editorSnapshot = json;
  editorTextareaEl.value = json;
}

function exitEditMode(keepChanges) {
  // keepChanges: se false, volta pro snapshot
  isEditing = false;

  btnEditEl.disabled = false;
  btnSaveEl.disabled = true;
  btnCancelEl.disabled = true;

  editorWrapEl.classList.add("hidden");
  tableWrapEl.classList.remove("hidden");

  if (!keepChanges) {
    editorTextareaEl.value = editorSnapshot;
  }
}

function saveEdits() {
  const day = getSelectedDay();
  const key = day.workoutKey;

  try {
    const parsed = JSON.parse(editorTextareaEl.value);

    // Validação simples: precisa ser array de objetos com campos básicos
    if (!Array.isArray(parsed)) {
      throw new Error("O JSON precisa ser uma lista (array) de exercícios.");
    }

    const normalized = parsed.map((x, idx) => {
      if (!x || typeof x !== "object") {
        throw new Error(`Item #${idx + 1} inválido. Deve ser um objeto.`);
      }
      return {
        name: String(x.name ?? ""),
        sets: String(x.sets ?? ""),
        reps: String(x.reps ?? ""),
        rest: String(x.rest ?? "")
      };
    });

    state.workouts[key] = normalized;
    persist();

    exitEditMode(true);
    renderWorkoutCard();
    alert("Treino salvo com sucesso (offline).");
  } catch (err) {
    alert("Não consegui salvar. Verifique o JSON.\n\nDetalhe: " + (err?.message || err));
  }
}

/* =========================================================
   Storage
   ========================================================= */

function loadState(forceDefault = false) {
  if (!forceDefault) {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);

        // Merge leve para manter compatibilidade se você atualizar DEFAULT_DATA
        return deepMerge(structuredClone(DEFAULT_DATA), parsed);
      } catch {
        // se der erro, cai no default
      }
    }
  }
  // Primeiro uso: tenta selecionar o dia atual automaticamente
  const st = structuredClone(DEFAULT_DATA);
  st.selectedDayKey = guessTodayKey();
  return st;
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getSelectedDay() {
  return state.days.find(d => d.key === state.selectedDayKey) || state.days;
}

/* =========================================================
   Utilitários
   ========================================================= */

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * Merge profundo simples (objetos/arrays)
 * - arrays do "source" substituem arrays do "target"
 * - objetos mesclam recursivamente
 */
function deepMerge(target, source) {
  if (Array.isArray(source)) return source.slice();
  if (source && typeof source === "object") {
    for (const k of Object.keys(source)) {
      const sv = source[k];
      const tv = target[k];
      if (Array.isArray(sv)) target[k] = sv.slice();
      else if (sv && typeof sv === "object") target[k] = deepMerge(tv && typeof tv === "object" ? tv : {}, sv);
      else target[k] = sv;
    }
  }
  return target;
}

/**
 * Seleciona automaticamente o dia atual (pt-BR)
 */
function guessTodayKey() {
  // getDay(): 0=Dom ... 6=Sáb
  const d = new Date().getDay();
  const map = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
  return map[d] || "seg";
}
