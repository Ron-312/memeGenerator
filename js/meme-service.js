'use strict'
var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gMemeCanvas;

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
{ id: 17, url: 'imgs/17.jpg', keywords: ['president', 'you!'] },
{ id: 18, url: 'imgs/18.jpg', keywords: ['you!'] },
];



function addImageToService(img) {
    let id = gImgs.length +1
    let imgObj = {
        id: id,
        url: img.src,
        keywords: ['myMeme']
    }
    gImgs.push(imgObj)
    saveCurrImgToService(imgObj)
}

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [],
}
function createLines(canvas) {
    gMemeCanvas = canvas
    var lines = [
        {
            txt: 'I never eat Falafel',
            fontFamily: 'Ariel',
            size: 40,
            align: 'left',
            color: 'white',
            strokeColor: 'black',
            xy: [30, 70]
        }, {
            txt: 'but I eat Mafrum ',
            fontFamily: 'Ariel',
            size: 40,
            align: 'left',
            color: 'white',
            strokeColor: 'black',
            xy: [30, canvas.height - 70]
        }];
    gMeme.lines = lines
}
function getTextCoords() {
    return gMeme.lines[gMeme.selectedLineIdx].xy;
}
function changeModalTextIndx(idx) {
    gMeme.selectedLineIdx = idx
}
// imgs

// function createImgs() {
//     // TODO: get imgs for gImgs from folder
//     for (let x = 0; x < 18; x++) {
//         gImgs.push(createImg())
//     }
// }
// function createImg() {
//     var img = {}
// }

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
    if (!currImg.classList) {
        var ImgIndex = (currImg.id)
        gMeme.selectedImgId = ImgIndex -1
    } else {
        var ImgIndex = (currImg.classList.value)
        gMeme.selectedImgId = +(ImgIndex.split("-"))[1] - 1
    }
}
function getCurrImgFromService() {
    return gImgs[gMeme.selectedImgId]
}
function changeModelText(text, selectedTextIndx) {
    gMeme.lines[selectedTextIndx].txt = text
    // gMeme.selectedLineIdx = selectedTextIndx
}
function getModelText(idx) {
    if (idx >= 0) {
        if(!(gMeme.lines[idx].txt === undefined)){
            return gMeme.lines[idx].txt
        }else{
            return "image"
        }
    }
}
function sendCoordsToModel(xy) {
    if (gMeme.selectedLineIdx >= 0) {
        let currXy = gMeme.lines[gMeme.selectedLineIdx].xy;
        currXy[0] = currXy[0] + xy[0]
        currXy[1] = currXy[1] + xy[1]
    }
}
function getLines() {
    return gMeme.lines
}


// ajusting text 

function changeFontSize(num) {
    if (gMeme.lines[gMeme.selectedLineIdx].fontFamily) {
        gMeme.lines[gMeme.selectedLineIdx].size += num

    } else if (!gMeme.lines[gMeme.selectedLineIdx].fontFamily) {
        gMeme.lines[gMeme.selectedLineIdx].width += num
        gMeme.lines[gMeme.selectedLineIdx].height += num
    }
}
function moveText(num) {
    gMeme.lines[gMeme.selectedLineIdx].xy[1] += num
}
function selectTextByCoord(xy) {
    let selectedTextIndx = gMeme.lines.findIndex((line, idx) => {
        if (!line.fontFamily) {
            if ((xy[1] >= line.xy[1]) && (xy[1] <= (line.xy[1] + line.height)) && (xy[0] >= line.xy[0]) && (xy[0] <= line.xy[0] + line.width)) {
                changeModalTextIndx(idx)
                return true
            }
            return
        }
        if ((xy[1]) >= (line.xy[1] - 40) && (xy[1]) <= (line.xy[1] + 50)) {
            changeModalTextIndx(idx)
            return true
        }
    }
    )
    return selectedTextIndx;
}
function addLine() {
    let newLine = {
        txt: 'new line',
        fontFamily: 'Ariel',
        size: 40,
        align: 'left',
        color: 'red',
        strokeColor: 'black',
        xy: [30, (gMemeCanvas.height / 2)]
    }
    gMeme.lines.push(newLine)
}
function addEmoji(emojiUrl) {
    let newEmoji = {
        url: emojiUrl,
        width: 40,
        height: 40,
        xy: [30, gMemeCanvas.height / 2]
    }
    gMeme.lines.push(newEmoji)
}

function alignRight(canvasWidth) {
    gMeme.lines[gMeme.selectedLineIdx].xy[0] = canvasWidth - 100;

}

function alignLeft(canvasWidth) {
    gMeme.lines[gMeme.selectedLineIdx].xy[0] = 0;
}
function alignCenter(canvasWidth) {
    gMeme.lines[gMeme.selectedLineIdx].xy[0] = canvasWidth / 2;
}
function changeTextStrokeChange(strokeColor) {
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = strokeColor
}
function changeTextFillChange(fillColor) {
    gMeme.lines[gMeme.selectedLineIdx].color = fillColor
}
function toTrash() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
}
function changeFontFamily(fontValue) {
    gMeme.lines[gMeme.selectedLineIdx].fontFamily = fontValue;
}