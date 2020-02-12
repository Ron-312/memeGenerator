// imgs variables
var gImgs;

// canvas variables
var gCanvas;
var gCtx;
var gChangeCanvas = false;

function onInit() {
    gImgs = getImgsToShow();
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    renderImgs();
    resizeCanvas();
    // TODO : addEventListeners() for fluid sensitivity
}
function renderImgs(){
    let elImgs = document.querySelector('.imgs');
    let strHTMLS = '';
    gImgs.forEach((img,idx) => {
        strHTMLS+=  `<img class="img-${idx+1}" src="imgs/${idx+1}.jpg " alt="" onclick="openMemeEditor(this)"></img>`
    });
    elImgs.innerHTML = strHTMLS;
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetHeight;
}

function openMemeEditor(currImg){
    var elContainer = document.querySelector('.canvas-container');
    // elContainer.removeAttribute("hidden")
    saveCurrImgToService(currImg)
    printImgOnCanvas();
    gChangeCanvas =true;
}
function printImgOnCanvas(){
  let selectedImgUrl =  getCurrImgFromService()
    var img = new Image()
    img.src = selectedImgUrl;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    }
}

function onChangeText(){
get
}

function drawText(text, x, y) {
    // gCtx.lineWidth = '2'
    // gCtx.strokeStyle = 'red'
    // gCtx.fillStyle = 'white'
    gCtx.font = '40px Ariel'
    // gCtx.textAlign = 'center'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}