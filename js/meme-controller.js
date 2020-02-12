// imgs variables
var gImgs;

// canvas variables
var gCanvas;
var gCtx;
var gChangeCanvas = false;

// text variables

var elText1 = document.querySelector('.text1')

function onInit() {
    gImgs = getImgsToShow();
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    renderImgs();
    resizeCanvas();
    // TODO : addEventListeners() for fluid sensitivity
}
function renderImgs() {
    let elImgs = document.querySelector('.imgs');
    let strHTMLS = '';
    gImgs.forEach((img, idx) => {
        strHTMLS += `<img class="img-${idx + 1}" src="imgs/${idx + 1}.jpg " alt="" onclick="openMemeEditor(this)"></img>`
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
    let selectedImgUrl = getCurrImgFromService()
    var img = new Image()
    img.src = selectedImgUrl;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        if(gChangeCanvas){
            
            drawText(elText1.value, 0, 0)
        }gChangeCanvas = true;
    }
}

function onChangeText() {
    debugger
    printImgOnCanvas()    
}

function drawText(text, x, y) {
    // gCtx.lineWidth = '2'
    // gCtx.strokeStyle = 'red'
    // gCtx.fillStyle = 'white'
    gCtx.font = '40px Ariel'
    // gCtx.textAlign = 'center'
    gCtx.fillText(text, 30, 40)
    gCtx.strokeText(text, 30, 40)
}