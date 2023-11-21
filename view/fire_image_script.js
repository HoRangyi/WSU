function ChangeFireImage() {
    
    //const mysql = require("mysql")
    //const sprintf = require("sprintf-js")
    
    var imageElement = document.getElementById('fire_image_test');

    if(imageElement){
        imageElement.src = "불남.jpg";
        imageElement.alt = "New Image"
    } else {
        console.error("이미지찾을수없음")
    }
}

// module.exports = {
//     ChangeFireImage : ChangeFireImage
// }