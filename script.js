// script.js
document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  let isDrawing = false;
  let selectedTool = "ellipse"; // Instrumentul implicit
  let shapes = []; // Tablou pentru stocarea formelor desenate
  let startX, startY;

  // Butoane
  const newTemplateBtn = document.getElementById("newTemplateBtn");
  const ellipseBtn = document.getElementById("ellipseBtn");
  const rectangleBtn = document.getElementById("rectangleBtn");
  const lineBtn = document.getElementById("lineBtn");
  ellipseBtn.classList.add("active"); //setez selectia instrumentului initial la incarcare.

  newTemplateBtn.addEventListener("click", createNewTemplate);
  ellipseBtn.addEventListener("click", () => setDrawingTool("ellipse"));
  rectangleBtn.addEventListener("click", () => setDrawingTool("rectangle"));
  lineBtn.addEventListener("click", () => setDrawingTool("line"));

  function createNewTemplate() {
    shapes = []; // Resetarea formelor desenate
    context.clearRect(0, 0, canvas.width, canvas.height);
    redrawShapes(); // Desenarea formelor salvate
  }

   function setDrawingTool(tool) {
    selectedTool = tool;
    // Adaugăm clasa 'active' la butonul selectat și o eliminăm de la celelalte
    ellipseBtn.classList.remove("active");
    rectangleBtn.classList.remove("active");
    lineBtn.classList.remove("active");

    if (tool === "ellipse") {
      ellipseBtn.classList.add("active");
    } else if (tool === "rectangle") {
      rectangleBtn.classList.add("active");
    } else if (tool === "line") {
      lineBtn.classList.add("active");
    }
  }

  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mousemove", draw);

  function startDrawing(e) {
    isDrawing = true;
    startX = e.clientX - canvas.getBoundingClientRect().left;
    startY = e.clientY - canvas.getBoundingClientRect().top;
  }

  function stopDrawing() {
    if (!isDrawing) return;

    isDrawing = false;
    const endX = event.clientX - canvas.getBoundingClientRect().left;
    const endY = event.clientY - canvas.getBoundingClientRect().top;
    saveShape(startX, startY, endX, endY); // Salvarea formei la eliberare
    context.beginPath(); // Întrerupe desenarea continuă pentru fiecare formă
    redrawShapes(); // Desenarea formelor salvate
  }

  function draw(e) {
    if (!isDrawing) return;

    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;

    context.clearRect(0, 0, canvas.width, canvas.height);

    redrawShapes(); // Desenarea formelor salvate

    if (selectedTool === "ellipse") {
      drawEllipse(startX, startY, mouseX, mouseY);
    } else if (selectedTool === "rectangle") {
      drawRectangle(startX, startY, mouseX, mouseY);
    } else if (selectedTool === "line") {
      drawLine(startX, startY, mouseX, mouseY);
    }
  }

  function saveShape(startX, startY, endX, endY) {
    // Salvarea informațiilor despre formă în tablou
    shapes.push({ tool: selectedTool, startX, startY, endX, endY });
  }

  function redrawShapes() {
    // Redesenarea tuturor formelor din tablou
    shapes.forEach(shape => {
      const { tool, startX, startY, endX, endY } = shape;
      if (tool === "ellipse") {
        drawEllipse(startX, startY, endX, endY);
      } else if (tool === "rectangle") {
        drawRectangle(startX, startY, endX, endY);
      } else if (tool === "line") {
        drawLine(startX, startY, endX, endY);
      }
    });
  }

  function drawEllipse(startX, startY, endX, endY) {
    const width = endX - startX;
    const height = endY - startY;

    context.beginPath();
    context.ellipse(startX + width / 2, startY + height / 2, Math.abs(width / 2), Math.abs(height / 2), 0, 0, 2 * Math.PI);
    context.stroke();
  }

  function drawRectangle(startX, startY, endX, endY) {
    const width = endX - startX;
    const height = endY - startY;

    context.beginPath();
    context.rect(startX, startY, width, height);
    context.stroke();
  }

  function drawLine(startX, startY, endX, endY) {
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
  }
});
