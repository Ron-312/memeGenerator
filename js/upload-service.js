'use strict'

// on submit call to this function
function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="share-btn-href" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" hidden onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
         </a>`
        document.querySelector('.share-btn-href').click()
    }

    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
    .then(function (res) {
        return res.text()
    })
    .then(onSuccess)
    .catch(function (err) {
        console.error(err)
    })
}


// The next 2 functions handle IMAGE UPLOADING to img tag from file system: 

function loadImageFromInput(ev, resizeCanvas) {
    document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader();
    
    reader.onload = function (event) {
        var img = new Image();
        img.onload = resizeCanvas.bind(null, img)
        img.src = event.target.result;
        addImageToService(img)
        printImgOnCanvas()
    }
    reader.readAsDataURL(ev.target.files[0]);
}

// function renderCanvas(img) {
//     gCanvas.width = img.width;
//     gCanvas.height = img.height;
//     gCtx.drawImage(img, 0, 0);
    // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
// }

