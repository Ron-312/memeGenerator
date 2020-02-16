'use strict'


// imgs variables
var gimgsController;

// canvas variables
var gCanvas;
var gCtx;
var gLines;
var gForDowload = false;
var gForSave = false;
// var gChangeCanvas = false;

// text variables

var gElText = document.querySelector('.text-1')
var gSelectedTextIndx = 0;
// touch variables
var gIsClicked = false;
var gXy = [];
var gDeltaForTouch = [0, 0]

function onInit() {
    gimgsController = getImgsToShow();
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');

    // addEventListeners();
    renderImgs();
    searchKeyWords();
    testHammer();

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
    createLines(gCanvas);
    saveCurrImgToService(currImg)
    printImgOnCanvas();
    scrollIntoViewTop()
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
            if (!line.fontFamily) {
                return drawEmoji(line, idx)
            }
            if (!gForDowload && !gForSave) {
                drawRect(line.xy[0], line.xy[1], (idx === gSelectedTextIndx))
            }
            if (gSelectedTextIndx === idx) {
                drawText(gElText.value, line.xy[0], line.xy[1], idx)
                if (gLines.length - 1 === idx) {
                    onloadSaveDownload()
                }
            } else {
                drawText('', line.xy[0], line.xy[1], idx)
                if (gLines.length - 1 === idx) {
                    onloadSaveDownload()
                }
            }
        })

        // } gChangeCanvas = true;
    }
}

function onChangeText() {
    printImgOnCanvas()
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

// draw
function drawText(text, x, y, idx) {
    if (!text) {
        text = getModelText(idx)
    }
    gCtx.strokeStyle = gLines[idx].strokeColor
    gCtx.font = `${gLines[idx].size}px ${gLines[idx].fontFamily}`
    gCtx.fillStyle = gLines[idx].color
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
    changeModelText(text, idx)
}
function drawRect(x, y, isSelected) {
    gCtx.beginPath()
    if (isSelected) {
        gCtx.fillStyle = 'rgba(179, 28, 28, 0.671)'
    } else {
        gCtx.fillStyle = 'rgba(182, 182, 182, 0.699)'
    }
    gCtx.fillRect(0, y - 40, gCanvas.width, 70)
}


function drawEmoji(currEmoji, idx) {
    var img = new Image()
    img.src = currEmoji.url;
    let spriteW = currEmoji.width, spriteH = currEmoji.height;
    let spriteX = currEmoji.xy[0], spriteY = currEmoji.xy[1];
    img.onload = (() => {
        // gCtx.drawImage(img, 0, 0);
        gCtx.drawImage(img, 0, 0, img.width, img.height, spriteX, spriteY, spriteW, spriteH);
        if (gLines.length - 1 === idx) {
            onloadSaveDownload()
        }

        // gCtx.drawImage(img,
        //     // source rectangle
        //     0, 0, spriteW, spriteH,
        //     // destination rectangle
        //     spriteX, spriteY, spriteW, spriteH);
    });


}


// event listeners

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    return [((evt[0] - rect.left) * scaleX), ((evt[1] - rect.top) * scaleY)]
    //   x: (evt[0] - rect.left) * scaleX,   // scale mouse coordinates after they have
    //   y: (evt[1] - rect.top) * scaleY     // been adjusted to be relative to element

}

function addEventListeners() {
    gCanvas.addEventListener('mousedown', e => {
        e.preventDefault();
        e.stopPropagation();
        gXy = [e.clientX, e.clientY];
        var pos = getMousePos(gCanvas, gXy);
        gXy = pos
        var index = selectTextByCoord(gXy)
        changeTextIndx(index)
        gElText.value = getModelText(index)
        printImgOnCanvas()
        gIsClicked = true;
        console.log('regular', e.clientX, e.clientY);
        console.log('pos', pos[0], pos[1])


    });
    gCanvas.addEventListener('mousemove', e => {
        e.preventDefault();
        e.stopPropagation();
        let xy = [e.clientX, e.clientY];
        var pos = getMousePos(gCanvas, xy)
        xy = pos
        let moveXy = [xy[0] - gXy[0], xy[1] - gXy[1]]
        if (gIsClicked) {
            sendCoordsToModel(moveXy)
            printImgOnCanvas()
            gXy = xy
        }
    });

    window.addEventListener('mouseup', e => {
        e.preventDefault();
        e.stopPropagation();
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
function onDownload() {
    gForDowload = true
    printImgOnCanvas()
}
function onSaveMeme() {
    gForSave = true
    printImgOnCanvas()
}
function onloadSaveDownload() {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    if (gForDowload) {
        let elLink = document.querySelector('.imgHref');
        elLink.href = imgContent
        elLink.download = 'newMeme.jpg'
        elLink.click();
        gForDowload = false;

    }
    if (gForSave) {
        saveToMemeList(imgContent)
        gForSave = false;
    }
}
function onChangeFontFamily() {
    var fontValue = document.querySelector('.font-select').value
    changeFontFamily(fontValue)
    printImgOnCanvas()
}
function onAddEmoji(emojiUrl) {
    addEmoji(emojiUrl)
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

function onReturnToGallery() {
    var elContainer = document.querySelector('.grid-modal');
    elContainer.style.display = 'none'
    document.querySelector('.imgs').style.display = 'grid'
    document.querySelector('.search-bar').style.display = 'flex'
    document.querySelector('.info').style.display = 'flex'
    document.querySelector('.savedMemes').style.display = 'none'
    createLines(gCanvas)
    scrollIntoViewTop()
}
function onToggleMenu() {
    document.body.classList.toggle('menu-open');
    document.body.classList.toggle('open')
}

function saveToMemeList(imgContent) {
    let localMemes = []
    if (loadFromStorage('memes')) {
        localMemes = loadFromStorage('memes')
    }
    localMemes.push(imgContent)
    saveToStorage('memes', localMemes)
}
function onShowMemeList() {
    var elContainer = document.querySelector('.grid-modal');
    elContainer.style.display = 'none'
    document.querySelector('.imgs').style.display = 'none'
    document.querySelector('.search-bar').style.display = 'none'
    document.querySelector('.info').style.display = 'none'
    document.querySelector('.savedMemes').style.display = 'grid'
    showMemeList()
    scrollIntoViewTop()
}
function showMemeList() {
    let elSavedMemes = document.querySelector('.savedMemes')
    let strHTML = ''
    let localMemes = loadFromStorage('memes')
    localMemes.forEach(meme => {
        strHTML += `<img class="memeImg" src="${meme}" alt="">`
    });
    elSavedMemes.innerHTML = strHTML;
}

function testHammer() {
    var lastPosY = 0;
    var lastPosX = 0;
    var isDragging = false;


    const elBox = document.getElementById('my-canvas')
    var hammerTime = new Hammer(elBox);
    hammerTime.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL }));
    // , threshold: 0
    console.log('hammer ready');

    hammerTime.on('panstart', function (ev) {

        ev.preventDefault();
        ev.srcEvent.stopPropagation();
        if (!isDragging) {
            gXy = [ev.center.x, ev.center.y];
            var pos = getMousePos(gCanvas, gXy);
            gXy = pos
            isDragging = true;
            lastPosX = pos[0];
            lastPosY = pos[1];
            var textPose = [lastPosX, lastPosY]
            var index = selectTextByCoord(textPose)
            changeTextIndx(index)
            gElText.value = getModelText(index)
            printImgOnCanvas()
        }
    });
    hammerTime.on('panmove', function (ev) {
        ev.preventDefault();
        ev.srcEvent.stopPropagation();
        // let moveXy = [ev.center.x - gXy[0], ev.center.y - gXy[1]]
        let moveXy = [ev.deltaX - gDeltaForTouch[0], ev.deltaY - gDeltaForTouch[1]]
        console.log(ev);

        sendCoordsToModel(moveXy)
        printImgOnCanvas()
        gDeltaForTouch = [gDeltaForTouch[0] + moveXy[0], gDeltaForTouch[1] + moveXy[1]]
    });

    hammerTime.on('panend', function (ev) {
        gDeltaForTouch = [0, 0]
        ev.preventDefault();
        ev.srcEvent.stopPropagation();
        if (ev.isFinal) {
            isDragging = false;
        }
    });
}


function scrollIntoViewTop() {
    document.querySelector('.main-container').scrollIntoView()
}

function onImgInput(ev) {
    loadImageFromInput(ev, resizeCanvas)
}