// script.js
document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    let isDrawing = false;
    let selectedTool = "elipsa"; // instrumentul implicit pentru desenare
    let shapes = []; // tablou pentru stocarea formelor desenate
    let selectedColor = "#000000"; // culoarea implicita pentru forme
    let selectedLineWidth = 5; // grosimea implicita a formelor
    let fillBool = false;
    let startX, startY;
    let bgColor = "#ffffff";

    // Butoane
    const btnSablonNou = document.getElementById("btnSablonNou");
    const colorPickerFundal = document.getElementById("colorPickerFundal");

    const colorPicker = document.getElementById("colorPicker");
    const fillCheckBox = document.getElementById("umplere");
    const lineWidthSlider = document.getElementById("lineWidthSlider");

    const btnElipsa = document.getElementById("btnElipsa");
    const btnDreptunghi = document.getElementById("btnDreptunghi");
    const btnLinie = document.getElementById("btnLinie");
    btnElipsa.classList.add("active"); //setez selectia instrumentului initial la incarcare.

    const btnExportPNG = document.getElementById("btnExportPNG");
    const btnExportJPEG = document.getElementById("btnExportJPEG");

    //evenimente
    btnSablonNou.addEventListener("click", createNewTemplate);
    colorPickerFundal.addEventListener("input", updateBackgroundColor);

    colorPicker.addEventListener("input", updateColor);
    fillCheckBox.addEventListener("change", updateFillOption);
    lineWidthSlider.addEventListener("input", updateLineWidth);

    btnElipsa.addEventListener("click", () => setDrawingTool("elipsa"));
    btnDreptunghi.addEventListener("click", () => setDrawingTool("dreptunghi"));
    btnLinie.addEventListener("click", () => setDrawingTool("linie"));

    btnExportPNG.addEventListener("click", () => exportImagine("png"));
    btnExportJPEG.addEventListener("click", () => exportImagine("jpeg"));

    //keybind-uri
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mousemove", draw);

    //functii initiere
    createNewTemplate();

    function createNewTemplate() {
        shapes = []; // resetare tablou forme
        context.clearRect(0, 0, canvas.width, canvas.height);
        saveShape("dreptunghi", 0, 0, canvas.width, canvas.height, bgColor, 0, true); //forma pentru fundal(folosita la culoare de fundal a sablonului)
        redrawShapes(); // desenarea formelor salvate in tablou
    }

    //functe ce seteaza pe front care este instrumentul activ.
    function setDrawingTool(tool) {
        selectedTool = tool;
        btnElipsa.classList.remove("active");
        btnDreptunghi.classList.remove("active");
        btnLinie.classList.remove("active");

        if (tool === "elipsa") {
            btnElipsa.classList.add("active");
        } else if (tool === "dreptunghi") {
            btnDreptunghi.classList.add("active");
        } else if (tool === "linie") {
            btnLinie.classList.add("active");
        }
    }


    //functie event pentru inceput desen.
    function startDrawing() {
        isDrawing = true;
        startX = event.clientX - canvas.getBoundingClientRect().left;
        startY = event.clientY - canvas.getBoundingClientRect().top;
    }

    //functie pentru actualizarea culorii din color picker.
    function updateColor() {
        selectedColor = colorPicker.value;
    }

    //functie pentru actualizarea grosimii din range slider.
    function updateLineWidth() {
        selectedLineWidth = lineWidthSlider.value;
    }

    //functie ce actualizeaza starea booleana a check box-ului pentru umplere forma.
    function updateFillOption() {
        fillBool = fillCheckBox.checked;
    }

    //functie ce actualizeaza culoarea de fundal a sablonului(a primei forme din tablou)
    //prin crearea unei noi forme de dreptunghi cu stare de umplere manevrez culoarea fundalului sablonului.
    function updateBackgroundColor() {
        bgColor = colorPickerFundal.value;
        shapes[0].color = bgColor;
        redrawShapes();
    }


    //Functie event pentru oprirea desenarii
    function stopDrawing() {
        if (!isDrawing) return; //verificare eveniment daca este in timpul unei desenari

        isDrawing = false;
        const endX = event.clientX - canvas.getBoundingClientRect().left;
        const endY = event.clientY - canvas.getBoundingClientRect().top;
        saveShape(selectedTool, startX, startY, endX, endY, selectedColor, selectedLineWidth, fillBool); // salvare forma pe apelul evenimentului
        context.beginPath(); //intrerupe desenarea continua(cu preview)
        redrawShapes(); // desenarea formelor salvate in tablou
    }

    // Functie event pentru desenare.
    function draw() {
        if (!isDrawing) return;

        const endX = event.clientX - canvas.getBoundingClientRect().left;
        const endY = event.clientY - canvas.getBoundingClientRect().top;

        context.clearRect(0, 0, canvas.width, canvas.height);
        redrawShapes(); // Desenarea formelor salvate

        context.strokeStyle = selectedColor; // Setarea culorii liniei
        context.lineWidth = selectedLineWidth;

        if (selectedTool === "elipsa") {
            drawEllipse(startX, startY, endX, endY);
        } else if (selectedTool === "dreptunghi") {
            drawRectangle(startX, startY, endX, endY);
        } else if (selectedTool === "linie") {
            drawLine(startX, startY, endX, endY);
        }
    }


    //functie pentru salvarea unei forme in tablou.
    function saveShape(selectedTool, startX, startY, endX, endY, selectedColor, selectedLineWidth, fillBool) {
        shapes.push({
            id: shapes.length + 1,
            tool: selectedTool,
            startX,
            startY,
            endX,
            endY,
            color: selectedColor,
            lineWidth: selectedLineWidth,
            fill: fillBool
        });
    }

    //functie pentru (re)desenarea formelor din tablou
    function redrawShapes() {

        const figureList = document.getElementById("figureList");
        figureList.innerHTML = ""; // Curățare lista

        shapes.forEach((shape, index) => {

            const {
                id,
                tool,
                startX,
                startY,
                endX,
                endY,
                color,
                lineWidth,
                fill
            } = shape;

            // Adăugare elemente în listă
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.innerHTML = `<strong>ID ${id}:</strong> ${tool} - ${fill ? "Umplere" : "Contur"} - Grosime: ${lineWidth}`;

            const deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-danger btn-sm";
            deleteButton.innerHTML = "Sterge";
            deleteButton.addEventListener("click", () => deleteShape(index));

            listItem.appendChild(deleteButton);
            figureList.appendChild(listItem);


            context.strokeStyle = color;
            context.lineWidth = lineWidth;

            if (fill) {
                context.fillStyle = color;
            } else {
                context.fillStyle = "transparent";
            }

            if (tool === "elipsa") {
                drawEllipse(startX, startY, endX, endY, fill);
            } else if (tool === "dreptunghi") {
                drawRectangle(startX, startY, endX, endY, fill);
            } else if (tool === "linie") {
                drawLine(startX, startY, endX, endY);
            }
        });
    }

    function deleteShape(index) {
        if (index === 0) return;
        shapes.splice(index, 1);
        redrawShapes(); // Redesenare după ștergere
    }

    // funtie desenare elipsa
    function drawEllipse(startX, startY, endX, endY, fill = false) {
        const width = endX - startX; //calculare latime
        const height = endY - startY; //calculare inaltime

        context.beginPath();
        context.ellipse(startX + width / 2, startY + height / 2, Math.abs(width / 2), Math.abs(height / 2), 0, 0, 2 * Math.PI);

        if (fill) { //conditie oarecum stupid pusa deoarece la apelarea pe desenare preview nu va aparea dar este utila la redesenarea formelor din tablou.
            context.fill(); //umplere
        } else {
            context.stroke(); // contur
        }
    }

    // functie desenare dreptunghi
    function drawRectangle(startX, startY, endX, endY, fill = false) {
        const width = endX - startX; //calculare latime
        const height = endY - startY; //calculare inaltime

        context.beginPath();
        context.rect(startX, startY, width, height);

        if (fill) { //conditie oarecum stupid pusa deoarece la apelarea pe desenare preview nu va aparea dar este utila la redesenarea formelor din tablou.
            context.fill(); //umplere
        } else {
            context.stroke(); //contur
        }
    }

    //functie desenare linie
    function drawLine(startX, startY, endX, endY) {
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
    }

    function exportImagine(type) {
        const dataURL = canvas.toDataURL(`image/${type}`);

        const a = document.createElement("a");

        a.href = dataURL;
        a.download = `sablon.${type}`;
        a.click();
    }
});