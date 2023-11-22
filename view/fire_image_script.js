// Modify your fetch function to handle the response
function loadProfile() {
    fetch("/profile")
      .then((response) => response.json())
      .then((data) => {
        // Assuming you have an image element with the id "fire_image_test"
        var imageElement = document.getElementById("fire_image_test");
        if (imageElement) {
          imageElement.src = data.newImageSrc;
          imageElement.alt = "New Image";
        } else {
          console.error("이미지 찾을 수 없음");
        }
      })
      .catch((error) => console.error("Error loading profile:", error));
  }
  