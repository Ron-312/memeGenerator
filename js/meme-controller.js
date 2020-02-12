// imgs variables
var gImgs;

// canvas variables
var gCanvas;
var gCtx;
var gLines;
// var gChangeCanvas = false;

// text variables

var elTexts = [document.querySelector('.text-1'), document.querySelector('.text-2')]
var gSelectedTextIndx = 0;
// touch variables
var gIsClicked = false;
var gXy = [];

function onInit() {
    gImgs = getImgsToShow();
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    addEventListeners()
    renderImgs();

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
    var elContainer = document.querySelector('.grid-modal');
    elContainer.style.display = 'grid'
    document.querySelector('.imgs').style.display = 'none'
    document.querySelector('.search-bar').style.display = 'none'
    resizeCanvas();
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
        gLines = getLines()
        gLines.forEach((line, idx) => {
            drawRect(line.xy[0], line.xy[1], (idx === gSelectedTextIndx))
            drawText(elTexts[idx].value, line.xy[0], line.xy[1], idx)
        })
        // } gChangeCanvas = true;
    }
}

function onChangeText() {
    printImgOnCanvas()
}

function drawText(text, x, y, idx) {
    if (!text) {
        text = getModelText(idx)
    }
    // gCtx.lineWidth = '2'
    // gCtx.strokeStyle = 'red'
    // gCtx.fillStyle = 'white'
    gCtx.font = `${gLines[idx].size}px Ariel`
    // gCtx.textAlign = 'center'
    gCtx.fillStyle = gLines[idx].color
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
    changeModelText(text, idx)
}
function changeTextIndx(idx) {
    if (!arguments.length && gSelectedTextIndx === 0) {
        idx = 1
    } else if (!arguments.length && gSelectedTextIndx === 1) {
        idx = 0
    }
    gSelectedTextIndx = idx
    changeModalTextIndx(idx)
    printImgOnCanvas()
}
function drawRect(x, y, isSelected) {
    // let txtCoords = getTextCoords()
    gCtx.beginPath()
    if (isSelected) {
        gCtx.fillStyle = 'rgba(179, 28, 28, 0.671)'
    } else {
        gCtx.fillStyle = 'rgba(182, 182, 182, 0.699)'
    }
    gCtx.fillRect(0, y - 40, gCanvas.width, 100)
}

function addEventListeners() {
    gCanvas.addEventListener('mousedown', e => {
        gXy = [e.clientX, e.clientY];
        var index = selectTextByCoord(gXy)
        changeTextIndx(index)
        printImgOnCanvas()
        gIsClicked = true;

    });
    gCanvas.addEventListener('mousemove', e => {
        let xy = [e.clientX, e.clientY];
        let moveXy = [xy[0] - gXy[0], xy[1] - gXy[1]]
        if (gIsClicked) {
            sendCoordsToModel(moveXy)
            printImgOnCanvas()
            gXy = xy
        }
    });

    window.addEventListener('mouseup', e => {
        gIsClicked = false
    });
}

// ajusting text

function onChangeFontSize(num) {
    changeFontSize(num)
    printImgOnCanvas();
}
function onMoveText(num) {
    moveText(num)
    printImgOnCanvas()
}
