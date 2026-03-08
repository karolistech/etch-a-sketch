const canvas = document.querySelector<HTMLDivElement>(".canvas")!;
const penColorInput = document.querySelector<HTMLInputElement>("#pen-color")!;
const canvasColorInput = document.querySelector<HTMLInputElement>("#canvas-color")!;
const randomBtn = document.querySelector<HTMLButtonElement>(".controls__btn--random")!;
const eraserBtn = document.querySelector<HTMLButtonElement>(".controls__btn--erase")!;

type Mode = "draw" | "random" | "erase";

const state = {
  mode: "draw" as Mode,
  penColor: penColorInput.value,
  canvasColor: canvasColorInput.value,
  gridSize: 16,
};

function createGrid(size: number) {
  canvas.replaceChildren();

  canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "canvas__cell";

    canvas.appendChild(cell);
  }
}

function setMode(mode: Mode) {
  state.mode = state.mode === mode ? "draw" : mode;
}

function updatePenColor() {
  state.penColor = penColorInput.value;
}

function updateCanvasColor() {
  state.canvasColor = canvasColorInput.value;
  canvas.style.backgroundColor = state.canvasColor;
}

function paintCell(e: PointerEvent) {
  if (e.buttons !== 1) return;
  if (!(e.target instanceof HTMLDivElement)) return;
  if (!e.target.matches(".canvas__cell")) return;

  const cell = e.target;

  switch (state.mode) {
    case "draw":
      cell.style.backgroundColor = state.penColor;
      break;
    case "random":
      cell.style.backgroundColor = getRandomColor();
      break;
    case "erase":
      cell.style.removeProperty("background-color");
  }
}

function getRandomColor(): string {
  const randomNumber = Math.floor(Math.random() * 0xffffff);
  const hexCode = `#${randomNumber.toString(16).padStart(6, "0")}`;

  return hexCode;
}

function setupEvents() {
  canvas.addEventListener("pointerdown", paintCell);
  canvas.addEventListener("pointerover", paintCell);

  penColorInput.addEventListener("input", updatePenColor);
  canvasColorInput.addEventListener("input", updateCanvasColor);

  randomBtn.addEventListener("click", () => setMode("random"));
  eraserBtn.addEventListener("click", () => setMode("erase"));
}

function init() {
  createGrid(state.gridSize);
  setupEvents();
}

init();
