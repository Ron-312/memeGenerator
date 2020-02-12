var gKeywords = { 'happy': 12, 'funny puk': 1 }

var gImgs = [{ id: 1, url: 'imgs/1.jpg', keywords: ['happy'] },
{ id: 2, url: 'imgs/2.jpg', keywords: ['happy'] },
{ id: 3, url: 'imgs/3.jpg', keywords: ['happy'] },
{ id: 4, url: 'imgs/4.jpg', keywords: ['happy'] },
{ id: 5, url: 'imgs/5.jpg', keywords: ['happy'] },
{ id: 6, url: 'imgs/6.jpg', keywords: ['happy'] },
{ id: 7, url: 'imgs/7.jpg', keywords: ['happy'] },
{ id: 8, url: 'imgs/8.jpg', keywords: ['happy'] },
{ id: 9, url: 'imgs/9.jpg', keywords: ['happy'] },
{ id: 10, url: 'imgs/10.jpg', keywords: ['happy'] },
{ id: 11, url: 'imgs/11.jpg', keywords: ['happy'] },
{ id: 12, url: 'imgs/12.jpg', keywords: ['happy'] },
{ id: 13, url: 'imgs/13.jpg', keywords: ['happy'] },
{ id: 14, url: 'imgs/14.jpg', keywords: ['happy'] },
{ id: 15, url: 'imgs/15.jpg', keywords: ['happy'] },
{ id: 16, url: 'imgs/16.jpg', keywords: ['happy'] },
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
            xy: [30, 70]
        }, {
            txt: 'but I eat Mafrum ',
            size: 40,
            align: 'left',
            color: 'red',
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

function getImgsToShow() {
    return gImgs
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
    gMeme.lines[gMeme.selectedLineIdx].xy = xy;
}
function getLines() {
    return gMeme.lines
}

// ajusting text 

function changeFontSize(num) {
    gMeme.lines[gMeme.selectedLineIdx].size += num
}
function moveText(num){
    gMeme.lines[gMeme.selectedLineIdx].xy[1] += num
}
