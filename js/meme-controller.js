// imgs variables
var gimgsController;

// canvas variables
var gCanvas;
var gCtx;
var gLines;
var gForDowload = false;
// var gChangeCanvas = false;

// text variables

var elText = document.querySelector('.text-1')
var gSelectedTextIndx = 0;
// touch variables
var gIsClicked = false;
var gXy = [];

function onInit() {
    gimgsController = getImgsToShow();
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    createLines(gCanvas)
    addEventListeners()
    renderImgs();
    searchKeyWords()

    // TODO : addEventListeners() for fluid sensitivity
}
function renderImgs() {
    let elImgs = document.querySelector('.imgs');
    let strHTMLS = '';
    gimgsController.forEach((img) => {
        strHTMLS += `<img class="img img-${img.id}" src="imgs/${img.id}.jpg " alt="" onclick="openMemeEditor(this)"></img>`
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
    document.querySelector('.info').style.display = 'none'
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
            if (!gForDowload) {
                drawRect(line.xy[0], line.xy[1], (idx === gSelectedTextIndx))
            }
            if (gSelectedTextIndx === idx) {
                drawText(elText.value, line.xy[0], line.xy[1], idx)
            } else {
                drawText('', line.xy[0], line.xy[1], idx)
            }
            if (gForDowload) {
                var imgContent = gCanvas.toDataURL('image/jpeg');
                document.querySelector('.download-btn').href = imgContent
                document.querySelector('.download-btn').download = 'puki.jpg'
            }
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
    gCtx.strokeStyle = gLines[idx].strokeColor
    gCtx.font = `${gLines[idx].size}px ${gLines[idx].fontFamily}`
    // gCtx.textAlign = 'left'
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
        elText.value = getModelText(index)
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
function onAddLine() {
    addLine()
    printImgOnCanvas()
}
function onAlign(whereTo) {
    let canvasWidth = gCanvas.width
    if (whereTo === 'left') {
        alignLeft(canvasWidth)
    } else if (whereTo === 'right') {
        alignRight(canvasWidth)
    } else {
        alignCenter(canvasWidth)
    }
    printImgOnCanvas()
}
function onClickStrokeChange() {
    let elStrokeColorChange = document.querySelector('.stroke-change-color')
    elStrokeColorChange.click()
}
function onTextStrokeChange() {
    let strokeColor = document.querySelector('.stroke-change-color').value
    changeTextStrokeChange(strokeColor)
    printImgOnCanvas()
}
function onClickFillChange() {
    let elFillColorChange = document.querySelector('.fill-change-color')
    elFillColorChange.click()
}
function onTextFillChange() {
    let fillColor = document.querySelector('.fill-change-color').value
    changeTextFillChange(fillColor)
    printImgOnCanvas()
}

function onToTrash() {
    toTrash()
    printImgOnCanvas()
}
function onDownload(elLink) {
    gForDowload = true
    printImgOnCanvas()
}
function onChangeFontFamily() {
    var fontValue = document.querySelector('.font-select').value
    changeFontFamily(fontValue)
    printImgOnCanvas()
}
function onAddEmoji(emoji) {
    addEmoji(emoji)
    printImgOnCanvas()
}

// filte\search

function onFilter() {
    let filterBy = document.querySelector('.search-input').value
    gimgsController = getImgsToShow(filterBy)
    renderImgs()
}
function searchKeyWords() {
    var searchKeyWords = [{ keyword: 'happy', numOfTimes: 0 }]
    let newKeyword = ''
    gimgsController.forEach(img => {
        img.keywords.forEach(imgKeyword => {
            let isInArr = searchKeyWords.find(keywordObj => {
                if ((keywordObj.keyword === imgKeyword)) {
                    keywordObj.numOfTimes++
                    return true
                }
                else {
                    newKeyword = imgKeyword
                    return false
                }
            })
            if (!isInArr) {
                searchKeyWords.push({ keyword: newKeyword, numOfTimes: 1 });
            }
        })
    })
    let elSearchKeywords = document.querySelector('.search-keywords')
    let strHTMLS = '';
    searchKeyWords.forEach((keywordObj) => {
        strHTMLS += `<a onclick="changeSearch('${keywordObj.keyword}')" style="font-size: ${(keywordObj.numOfTimes * 1.5) + 16}px;">${keywordObj.keyword}</a>`
    });
    elSearchKeywords.innerHTML = strHTMLS;
}

function changeSearch(searchText) {
    document.querySelector('.search-input').value = searchText
    onFilter()
}

function onReturnToGallery(){
    var elContainer = document.querySelector('.grid-modal');
    elContainer.style.display = 'none'
    document.querySelector('.imgs').style.display = 'grid'
    document.querySelector('.search-bar').style.display = 'flex'
    document.querySelector('.info').style.display = 'flex'
}
function onToggleMenu() {
    document.body.classList.toggle('menu-open');
    document.body.classList.toggle('open')
}