var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gImgs = [{ id: 1, url: 'imgs/1.jpg', keywords: ['happy'] },
{ id: 2, url: 'imgs/2.jpg', keywords: ['happy'] }
];
var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I never eat Falafel',
            size: 20,
            align: 'left',
            color: 'red'
        }, {
            txt: 'I never eat Falafel',
            size: 20,
            align: 'left',
            color: 'red'
        }
    ]
}

// imgs

function createImgs() {
    // TODO: get imgs for gImgs from folder
    createImgs()
}

function getImgsToShow() {
    return gImgs
}