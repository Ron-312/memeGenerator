// imgs variables
var gImgs;

// canvas variables
var gCanvas;
var gCtx;
// var gChangeCanvas = false;

// text variables

var elText1 = document.querySelector('.text1')
var elText2 = document.querySelector('.text2')
var gSelectedTextIndx = 0;

function onInit() {
    gImgs = getImgsToShow();
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    addEventListeners()
    renderImgs();
    resizeCanvas();
    // TODO : addEventListeners() for fluid sensitivity
}
function renderImgs() {
    let elImgs = document.querySelector('.imgs');
    let strHTMLS = '';
    gImgs.forEach((img, idx) => {
        strHTMLS += `<img class="img img-${idx + 1}" src="imgs/${idx + 1}.jpg " alt="" onclick="openMemeEditor(this)"></img>`
    });
    elImgs.innerHTML = strHTMLS;
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetHeight;
}

function openMemeEditor(currImg) {
    var elContainer = document.querySelector('.canvas-container');
    // elContainer.removeAttribute("hidden")
    saveCurrImgToService(currImg)
    printImgOnCanvas();

}
function printImgOnCanvas() {
    let selectedImgUrl = getCurrImgFromService().url
    var img = new Image()
    img.src = selectedImgUrl;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        // if (gChangeCanvas) {
            drawRect()
            drawText(elText1.value)

            drawRect()
            drawText(elText2.value)
        // } gChangeCanvas = true;
    }
}

function onChangeText() {
    printImgOnCanvas()
}

function drawText(text , x, y) {
    if(!text){
        text = getModelText()
    }
    let txtCoords = getTextCoords()
    // gCtx.lineWidth = '2'
    // gCtx.strokeStyle = 'red'
    // gCtx.fillStyle = 'white'
    gCtx.font = '40px Ariel'
    // gCtx.textAlign = 'center'
    gCtx.fillStyle = 'black'
    gCtx.fillText(text, txtCoords[0], txtCoords[1])
    gCtx.strokeText(text, txtCoords[0], txtCoords[1])
    changeModelText(text,gSelectedTextIndx)
}
function drawRect(x, y) {
    let txtCoords = getTextCoords()
    gCtx.beginPath()
    gCtx.fillStyle = 'rgba(182, 182, 182, 0.699)'
    gCtx.fillRect(0, txtCoords[1]-40, gCanvas.width, 100)
}

function addEventListeners() {
    gCanvas.addEventListener('mousedown', e => {
        let xy = [e.clientX,e.clientY];
        sendCoordsToModel(xy)
        printImgOnCanvas()
    });

    // gCanvas.addEventListener('mousemove', e => {
    //     if (isDrawing === true) {
    //         console.log(e)
    //         var mousex = e.pageX;
    //         var mousey = e.pageY;
    //         if (gLastMouseX > -1)
    //             gMouseTravel = Math.max(Math.abs(mousex - gLastMouseX), Math.abs(mousey - gLastMouseY));
    //         gLastMouseX = mousex;
    //         gLastMouseY = mousey;
    //         draw(x, y, e.clientX, e.clientY);
    //         x = e.clientX;
    //         y = e.clientY;
    //     }
    // });

    // window.addEventListener('mouseup', e => {
    //     if (isDrawing === true) {
    //         resetMouseSpeed()
    //         draw(x, y, e.clientX, e.clientY);
    //         x = 0;
    //         y = 0;
    //         isDrawing = false;
    //     }
    // });
}