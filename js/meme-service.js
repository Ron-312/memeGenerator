var gKeywords = { 'happy': 12, 'funny puk': 1 }

var gImgs = [{ id: 1, url: 'imgs/1.jpg', keywords: ['president', 'face'] },
{ id: 2, url: 'imgs/2.jpg', keywords: ['animals'] },
{ id: 3, url: 'imgs/3.jpg', keywords: ['animals', 'baby'] },
{ id: 4, url: 'imgs/4.jpg', keywords: ['animals'] },
{ id: 5, url: 'imgs/5.jpg', keywords: ['happy', 'baby'] },
{ id: 6, url: 'imgs/6.jpg', keywords: ['happy'] },
{ id: 7, url: 'imgs/7.jpg', keywords: ['happy', 'baby'] },
{ id: 8, url: 'imgs/8.jpg', keywords: ['happy'] },
{ id: 9, url: 'imgs/9.jpg', keywords: ['happy', 'baby'] },
{ id: 10, url: 'imgs/10.jpg', keywords: ['happy', 'president'] },
{ id: 11, url: 'imgs/11.jpg', keywords: ['happy', 'kiss'] },
{ id: 12, url: 'imgs/12.jpg', keywords: ['you!'] },
{ id: 13, url: 'imgs/13.jpg', keywords: ['happy', 'you!'] },
{ id: 14, url: 'imgs/14.jpg', keywords: ['matrix'] },
{ id: 15, url: 'imgs/15.jpg', keywords: ['happy'] },
{ id: 16, url: 'imgs/16.jpg', keywords: ['happy', 'you!'] },
];

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I never eat Falafel',
            size: 40,
            align: 'left',
            color: 'red',
            strokeColor :'black',
            xy: [30, 70]
        }, {
            txt: 'but I eat Mafrum ',
            size: 40,
            align: 'left',
            color: 'red',
            strokeColor :'black',
            xy: [30, 200]
        }
    ]
}
function getTextCoords() {
    return gMeme.lines[gMeme.selectedLineIdx].xy;
}
function changeModalTextIndx(idx) {
    gMeme.selectedLineIdx = idx
}
// imgs

function createImgs() {
    // TODO: get imgs for gImgs from folder
    for (let x = 0; x < 18; x++) {
        gImgs.push(createImg())
    }
}
function createImg() {
    var img = {}
}

function getImgsToShow(filterBy) {
    if (!arguments.length) return gImgs
    var res = gImgs.filter(img => {
        let includeImg = false;
        img.keywords.forEach(keyword => {
            if (keyword.includes(filterBy)) {
                includeImg = true;
            }
        });
        return includeImg
    })
    return res
}

function saveCurrImgToService(currImg) {
    var ImgIndex = (currImg.classList.value)
    gMeme.selectedImgId = +(ImgIndex.split("-"))[1] - 1
}
function getCurrImgFromService() {
    return gImgs[gMeme.selectedImgId]
}
function changeModelText(text, selectedTextIndx) {
    gMeme.lines[selectedTextIndx].txt = text
    // gMeme.selectedLineIdx = selectedTextIndx
}
function getModelText(idx) {
    return gMeme.lines[idx].txt
}
function sendCoordsToModel(xy) {
    let currXy = gMeme.lines[gMeme.selectedLineIdx].xy;
    currXy[0] = currXy[0] + xy[0]
    currXy[1] = currXy[1] + xy[1]
}
function getLines() {
    return gMeme.lines
}

// ajusting text 

function changeFontSize(num) {
    gMeme.lines[gMeme.selectedLineIdx].size += num
}
function moveText(num) {
    gMeme.lines[gMeme.selectedLineIdx].xy[1] += num
}
function selectTextByCoord(xy) {
    let selectedTextIndx = gMeme.lines.findIndex((line, idx) => {
        if ((xy[1]) >= (line.xy[1] - 40) && (xy[1]) <= (line.xy[1] + 100)) {
            changeModalTextIndx(idx)
            return true
        }
    }
    )
    return selectedTextIndx;
}
function AddLine() {
    let newLine = {
        txt: 'new line',
        size: 40,
        align: 'left',
        color: 'red',
        strokeColor :'black',
        xy: [30, 100]
    }
    gMeme.lines.push(newLine)
}

function alignRight(canvasWidth) {
    gMeme.lines.forEach(line => {
        line.xy[0] = canvasWidth - 30;
    })
}

function alignLeft(canvasWidth) {
    gMeme.lines.forEach(line => {
        line.xy[0] = 0;
    })
}
function alignCenter(canvasWidth) {
    gMeme.lines.forEach(line => {
        line.xy[0] = canvasWidth/2;
    })
}
function changeTextStrokeChange(strokeColor){
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = strokeColor
}
function changeTextFillChange(fillColor){
    gMeme.lines[gMeme.selectedLineIdx].color = fillColor
}
function toTrash(){
gMeme.lines.splice(gMeme.selectedLineIdx,1)
}