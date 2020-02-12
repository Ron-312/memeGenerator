// imgs variables
var gImgs;

// canvas variables
var gCanvas;
var gCtx;

function onInit() {
    gImgs = getImgsToShow()
    gCanvas = document.querySelector('#my-canvas')
    gCtx = gCanvas.getContext('2d')
    renderImgs()
    resizeCanvas()
    // TODO : addEventListeners() for fluid sensitivity
}
function renderImgs(){
    let elImgs = document.querySelector('.imgs')
    let strHTMLS = ''
    gImgs.forEach((img,idx) => {
        strHTMLS+=  `<img class="img-${idx+1}" src="imgs/${idx+1}.jpg " alt="" onclick="openMemeEditor(this)"></img>`
    });
    elImgs.innerHTML = strHTMLS;
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
}

function openMemeEditor(currImg){
    var elContainer = document.querySelector('.canvas-container');
    elContainer.hidden = 'none'
    
}