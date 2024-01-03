// script.js
document.addEventListener("DOMContentLoaded", function() {
    //variabile generale
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    let isDrawing = false;
    let selectedTool = "elipsa"; // instrumentul implicit pentru desenare
    let shapes = []; // tablou pentru stocarea formelor desenate
    let selectedColor = "#000000"; // culoarea implicita pentru forme
    let selectedGrosime = 5; // grosimea implicita a formelor
    let fillBool = false;
    let startX, startY;
    let bgColor = "#ffffff";
	
	let boolIdForme = false;

    //butoane
    const btnSablonNou = document.getElementById("btnSablonNou");
    const colorPickerFundal = document.getElementById("colorPickerFundal");

    const colorPicker = document.getElementById("colorPicker");
    const fillCheckBox = document.getElementById("umplere");
    const sliderGrosime = document.getElementById("sliderGrosime");

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
    sliderGrosime.addEventListener("input", updateGrosime);

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
	
	//toggle id forme///////////////////////
	const btnAfisareIduri = document.getElementById("btnAfisareIduri");
	btnAfisareIduri.addEventListener("click", () => toggleIds());

	function toggleIds() {
		boolIdForme = !boolIdForme; //opusul starii actuale
		redrawShapes();//redesenare
	}
	/////////////////////////////////////

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

		//comutare buton activ.
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
    function updateGrosime() {
        selectedGrosime = sliderGrosime.value;
    }

    //functie ce actualizeaza starea booleana in functie de starea checkbox-ului pentru umplere forma.
    function updateFillOption() {
        fillBool = fillCheckBox.checked;
    }

    //functie ce actualizeaza culoarea de fundal a sablonului(a primei forme din tablou)
    //prin crearea unei noi forme de dreptunghi cu stare de umplere manevrez culoarea fundalului sablonului.
    function updateBackgroundColor() {
        bgColor = colorPickerFundal.value; //obtin culoarea din colorpicker.
        shapes[0].color = bgColor; //practic actualizez prima forma din tablou deoarece forma cu index 0 este un dreptunghi pe intreaga suprafata a sablonului.
        redrawShapes();//redesenare forme din tablou
    }


    //Functie event pentru oprirea desenarii
    function stopDrawing() {
        if (!isDrawing) return; //verificare eveniment daca este in timpul unei desenari

        isDrawing = false;
        const endX = event.clientX - canvas.getBoundingClientRect().left; //functie generala de obtinere a coordonatei de final pentru latime.
        const endY = event.clientY - canvas.getBoundingClientRect().top; //functie generala de obtinere a coordonatei de final pentru inaltime.
        saveShape(selectedTool, startX, startY, endX, endY, selectedColor, selectedGrosime, fillBool); // salvare forma pe apelul evenimentului
        context.beginPath(); //intrerupe desenarea continua(cu preview)
        redrawShapes(); // desenarea formelor salvate in tablou
    }

    // Functie event pentru desenare.
    function draw() {
        if (!isDrawing) return;

        const endX = event.clientX - canvas.getBoundingClientRect().left; //functie generala de obtinere a coordonatei de final pentru latime.
        const endY = event.clientY - canvas.getBoundingClientRect().top; //functie generala de obtinere a coordonatei de final pentru inaltime.

        context.clearRect(0, 0, canvas.width, canvas.height); //functie de curatare a sablonului. Practic sterge pixelii de pe intreaga suprafata a sablonului.
        redrawShapes(); // redesenarea formelor salvate

        context.strokeStyle = selectedColor; // setarea culorii formei
        context.lineWidth = selectedGrosime; //setare grosime forma

        //conditie pentru verificarea starii booleene de umplere. Daca este true, la preview se vor face setarile necesare pentru a afisa preview-ul figurii in mod corespunzator(adica forma cu umplere sau fara).
        if (fillBool) {
            context.fillStyle = selectedColor;
        } else {
            context.fillStyle = "transparent";
        }

        //desenare forma in functie de forma selectata din navbar.
        if (selectedTool === "elipsa") {
            drawEllipse(startX, startY, endX, endY, fillBool); //desenare forma
        } else if (selectedTool === "dreptunghi") {
            drawRectangle(startX, startY, endX, endY, fillBool); //desenare forma
        } else if (selectedTool === "linie") {
            drawLine(startX, startY, endX, endY); //desenare forma
        }
    }


    //functie pentru salvarea unei forme in tablou.
    function saveShape(selectedTool, startX, startY, endX, endY, selectedColor, selectedGrosime, fillBool) {
        shapes.push({
            id: shapes.length + 1, //id-ul e pus cam inutil deoarece am vrut sa-i atribui o folosinta dar am realizat ca este mai usor sa ma folosesc direct de index.
            tool: selectedTool,
            startX,
            startY,
            endX,
            endY,
            color: selectedColor,
            lineWidth: selectedGrosime,
            fill: fillBool
        }); //introducere forma in tablou.
    }

    //functie pentru (re)desenarea formelor din tablou
    function redrawShapes() {

        const listaFiguri = document.getElementById("listaFiguri"); //obtin listView-ul de pe front intr-o constanta.
        listaFiguri.innerHTML = ""; //curatare lista pentru a nu suprapune elemente.

        shapes.forEach((shape, index) => {
            const {
                id, //id-ul e pus cam inutil deoarece am vrut sa-i atribui o folosinta dar am realizat ca este mai usor sa ma folosesc direct de index.
                tool,
                startX,
                startY,
                endX,
                endY,
                color,
                lineWidth,
                fill
            } = shape; //atribuie variabilelor atributele formei de pe index.
			
			if (boolIdForme) {
				context.strokeStyle = "black"; // culoare neagra contur
				context.lineWidth = 2; // latime contur
				context.strokeText(`Index: ${index}`, startX, startY - 5); //text interior
				context.fillStyle = "white"; //culoarea textului interior(alb)
				context.fillText(`Index: ${index}`, startX, startY - 5); //adaugarea textului interior

			}

            //functii legate de adaugarea in lista a elementelor din tablou. *******************************************************************
            const listaForme = document.createElement("li");
            listaForme.className = "list-group-item d-flex justify-content-between align-items-center";
            listaForme.innerHTML = `<strong>Index ${index}:</strong> Id: ${id} ${tool} - ${fill ? "Umplere" : "Contur"} - Grosime: ${lineWidth}`;

            const btnSterge = document.createElement("button");
            btnSterge.className = "btn btn-danger btn-sm";
            btnSterge.innerHTML = "Sterge";
            btnSterge.addEventListener("click", () => deleteShape(index));

            listaForme.appendChild(btnSterge); //trimit request-ul final de afisare a elementului.
            listaFiguri.appendChild(listaForme);//trimit request-ul final de afisare a elementului.
			//sfarsit functii ********************************************************************************************************************

			//revenire la forme
            context.strokeStyle = color;
            context.lineWidth = lineWidth;

			//cu umplere sau fara umplere
            if (fill) {
                context.fillStyle = color;
            } else {
                context.fillStyle = "transparent";
            }

            if (tool === "elipsa") {
                drawEllipse(startX, startY, endX, endY, fill); //desenare forma
            } else if (tool === "dreptunghi") {
                drawRectangle(startX, startY, endX, endY, fill);//desenare forma
            } else if (tool === "linie") {
                drawLine(startX, startY, endX, endY);//desenare forma
            }
        });
    }

	//functie ce sterge o forma de pe un index primit ca parametru
    function deleteShape(index) {
        if (index === 0) return; //nu permitem stergerea figurii de pe index 0(fundalul)
        shapes.splice(index, 1); //stergem o singura intrare din tablou de pe index-ul primit.
        redrawShapes(); // Redesenare după ștergere
    }

    // funtie desenare elipsa
    function drawEllipse(startX, startY, endX, endY, fill = false) {
        const width = endX - startX; //calculare latime
        const height = endY - startY; //calculare inaltime

        context.beginPath(); //incepere sub-traseu desenare pentru forma.
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

        context.beginPath();//incepere sub-traseu desenare pentru forma.
        context.rect(startX, startY, width, height); //desenare dreptunghi

        if (fill) { //conditie oarecum stupid pusa deoarece la apelarea pe desenare preview nu va aparea dar este utila la redesenarea formelor din tablou.
            context.fill(); //umplere
        } else {
            context.stroke(); //contur
        }
    }

    //functie desenare linie
    function drawLine(startX, startY, endX, endY) {
        context.beginPath();
        context.moveTo(startX, startY); //ne mutam cu pozitia la coordonata de inceput
        context.lineTo(endX, endY); //tragem o linie de la coordonata de inceput pana la coordonata de final primita la release mouse key.
        context.stroke(); //contur
    }

    function exportImagine(type) {
		const temp = boolIdForme; //salvez temporar starea pentru afisarea id-urilor ca sa nu le exportez si pe acestea la salvarea imaginii.
		boolIdForme = false;
		redrawShapes();//redesenare
		
        const dataURL = canvas.toDataURL(`image/${type}`); //obtinem datele despre figurile din sablon

        const a = document.createElement("a");

        a.href = dataURL;
        a.download = `sablon.${type}`;
        a.click();
		
		boolIdForme = temp; //revenire la starea initiala a bool-ului.
		redrawShapes();//redesenare
    }
});