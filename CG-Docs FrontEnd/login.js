function checkUser() {
  let user = document.getElementById("users").value;
  let password = document.getElementById("password").value;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    username: user,
    password: password,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:57719/api/Login", requestOptions)
    .then((response) => response.json())
    .then((result) => showstorage(result))
    .catch((error) => console.log("error", error));
}

//Token in session storage
function showstorage(data) {
  if (data.token != null && data.token != undefined && data.token != "") {
    console.log(data);
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("id", data.id);
    sessionStorage.setItem("admin", data.name);
  }
  loc();
}

//function  redirectng to dashboard through login
function loc() {
  if (sessionStorage.getItem("token") != null) {
    window.location.href = "dashboard.html";
  } else {
    alert("Login Credentials are wrong");
  }
}
