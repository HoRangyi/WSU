// 현재 편집 중인 카드 번호를 추적하기 위한 전역 변수
var currentEditingUserId = null;
function loadProfile() {
  fetch("/profile")
    .then((response) => response.json())
    .then((data) => {
      // 서버로부터 받은 데이터를 ID가 일치하는 HTML 요소에 할당합니다.
      // 이 부분은 서버의 응답 데이터 구조에 따라 달라질 수 있습니다.
      document.getElementById("serial1").innerText = data.serial;
      document.getElementById("username1").innerText = data.username;
      document.getElementById("address1").innerText = data.address;
      document.getElementById("phone1").innerText = data.phone;
    })
    .catch((error) => console.error("Error loading profile:", error));
}
function toggleEdit(button) {
  var userId = button.getAttribute("data-userid");
  currentEditingUserId = userId;

  var serialId = "serial" + userId;
  var usernameId = "username" + userId;
  var addressId = "address" + userId;
  var phoneId = "phone" + userId;

  var serial = document.getElementById(serialId);
  var username = document.getElementById(usernameId);
  var address = document.getElementById(addressId);
  var phone = document.getElementById(phoneId);

  // 모달에 현재 값을 설정합니다.
  document.getElementById("usernameInputModal").value = username.innerText;
  document.getElementById("addressInputModal").value = address.innerText;
  document.getElementById("serialInputModal").value = serial.innerText;
  document.getElementById("phoneInputModal").value = phone.innerText;

  // Bootstrap 모달 인스턴스를 생성하고 표시합니다.
  var myModal = new bootstrap.Modal(
    document.getElementById("editProfileModal")
  );
  myModal.show();
}

// 프로필 저장 함수
function saveProfile() {
  // 모달 폼에서 입력된 데이터를 가져옵니다.
  var username = document.getElementById("usernameInputModal").value;
  var address = document.getElementById("addressInputModal").value;
  var serial = document.getElementById("serialInputModal").value;
  var phone = document.getElementById("phoneInputModal").value;

  // 현재 편집 중인 사용자 ID를 사용하여 업데이트합니다.
  var target = currentEditingUserId;

  // 특정 카드의 표시 요소를 업데이트합니다.
  document.getElementById("username" + target).innerText = username;
  document.getElementById("address" + target).innerText = address;
  document.getElementById("serial" + target).innerText = serial;
  document.getElementById("phone" + target).innerText = phone;

  // 모달을 닫습니다.
  var myModalEl = document.getElementById("editProfileModal");
  var modal = bootstrap.Modal.getInstance(myModalEl);
  modal.hide();

  // 서버로 데이터를 전송하는 AJAX 요청을 수행합니다.
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/update-profile", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // 데이터 저장 성공 시 로직을 실행합니다.
      console.log("Profile updated successfully");
    }
  };
  xhr.send(
    JSON.stringify({
      username: username,
      address: address,
      serial: serial,
      phone: phone,
    })
  );
}

// 페이지 로드 시 사용자 프로필을 로드하는 함수입니다.
function loadProfile() {
  // 서버에서 프로필 데이터를 가져오는 AJAX 요청을 수행합니다.
  // 해당 부분은 구현되어 있지 않으므로 구현이 필요합니다.
}

function addNewProfile() {
  // 새로운 사용자 ID 생성 (임시로 사용하는 예제 ID)
  var newUserId = Date.now(); // 예시용: 현재 타임스탬프를 사용

  // 입력된 값들을 가져옵니다.
  var name = document.getElementById("newName").value;
  var address = document.getElementById("newAddress").value;
  var serial = document.getElementById("newSerial").value;
  var phone = document.getElementById("newPhone").value;

  // 새 프로필 카드 HTML을 생성합니다.
  var cardHtml = `
    <div class="col mb-5">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title" id="username${newUserId}">${name}</h5>
          <p class="card-text" id="address${newUserId}">${address}</p>
          <p class="card-text" id="serial${newUserId}">${serial}</p>
          <p class="card-text" id="phone${newUserId}">${phone}</p>
          <img src="0.png" alt="Profile Image" style="width: 100%; height: auto;">
        </div>
        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
          <div class="text-center">
            <button class="btn btn-outline-dark mt-auto" data-userid="${newUserId}" onclick="toggleEdit(this)">
              편집
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // 새 카드를 페이지에 추가합니다.
  var container = document.querySelector(".row");
  container.insertAdjacentHTML("beforeend", cardHtml);

  // 모달을 닫고 입력 필드를 초기화합니다.
  var myModalEl = document.getElementById("addProfileModal");
  var modal = bootstrap.Modal.getInstance(myModalEl);
  modal.hide();

  // 입력 필드 초기화
  document.getElementById("newName").value = "";
  document.getElementById("newAddress").value = "";
  document.getElementById("newSerial").value = "";
  document.getElementById("newPhone").value = "";
}

// 페이지가 완전히 로드될 때 loadProfile 함수를 호출합니다.
document.addEventListener("DOMContentLoaded", loadProfile);
