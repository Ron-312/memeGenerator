
var gImgs;

function onInit() {
    gImgs = getImgsToShow()
    renderImgs()
}
function renderImgs(){
    let elImgs = document.querySelector('.imgs')
    let strHTMLS = ''
    gImgs.forEach((img,idx) => {
        strHTMLS+=  `<img class="img-${idx+1}" src="imgs/${idx+1}.jpg " alt=""></img>`
    });
    elImgs.innerHTML = strHTMLS;
}