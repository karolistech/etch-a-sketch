const canvas = document.querySelector<HTMLDivElement>(".canvas")!;
const penColorInput = document.querySelector<HTMLInputElement>("#pen-color")!;
const canvasColorInput = document.querySelector<HTMLInputElement>("#canvas-color")!;
const gridSizeLabel = document.querySelector<HTMLLabelElement>("label[for='grid-size']")!;
const gridSizeInput = document.querySelector<HTMLInputElement>("#grid-size")!;
const randomBtn = document.querySelector<HTMLButtonElement>(".controls__btn--randomize")!;
const eraserBtn = document.querySelector<HTMLButtonElement>(".controls__btn--erase")!;
const gridLinesBtn = document.querySelector<HTMLButtonElement>(".controls__btn--grid-lines")!;
const clearBtn = document.querySelector<HTMLButtonElement>(".controls__btn--clear")!;

type Mode = "draw" | "randomize" | "erase";

const state = {
  mode: "draw" as Mode,
  penColor: penColorInput.value,
  canvasColor: canvasColorInput.value,
  gridSize: 16,
  gridLines: true
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

  randomBtn.classList.toggle("controls__btn--selected", state.mode === "randomize");
  eraserBtn.classList.toggle("controls__btn--selected", state.mode === "erase");
}

function updatePenColor() {
  state.penColor = penColorInput.value;
}

function updateCanvasColor() {
  state.canvasColor = canvasColorInput.value;
  canvas.style.backgroundColor = state.canvasColor;
}

function updateGridSize(e: Event) {
  const gridSize = Number(gridSizeInput.value);

  gridSizeLabel.textContent = `Grid Size: ${gridSize} x ${gridSize}`;

  if (e.type === "change") {
    state.gridSize = gridSize;
    createGrid(gridSize);
  }
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
    case "randomize":
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

function toggleGridLines() {
  state.gridLines = !state.gridLines;

  canvas.classList.toggle("canvas--grid", state.gridLines);
  gridLinesBtn.classList.toggle("controls__btn--selected", state.gridLines);
}

function clearCanvas() {
  const cells = canvas.querySelectorAll<HTMLDivElement>(".canvas__cell");
  cells.forEach(cell => cell.style.removeProperty("background-color"));
}

function setupEvents() {
  canvas.addEventListener("pointerdown", paintCell);
  canvas.addEventListener("pointerover", paintCell);

  penColorInput.addEventListener("input", updatePenColor);
  canvasColorInput.addEventListener("input", updateCanvasColor);
  gridSizeInput.addEventListener("input", updateGridSize);
  gridSizeInput.addEventListener("change", updateGridSize);

  randomBtn.addEventListener("click", () => setMode("randomize"));
  eraserBtn.addEventListener("click", () => setMode("erase"));
  gridLinesBtn.addEventListener("click", toggleGridLines);
  clearBtn.addEventListener("click", clearCanvas);
}

function init() {
  createGrid(state.gridSize);
  setupEvents();
}

init();
