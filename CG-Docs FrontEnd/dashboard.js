let formname = document.getElementById("file");
var data = new Date();
const userid = sessionStorage.getItem("id");

//Folder creation
function createfolder() {
  try {
    fetch("http://localhost:57719/api/Folder", {
      body: JSON.stringify({
        FolderName: formname.value,
        FolderCreatedBy: sessionStorage.getItem("id"),
        FolderCreatedAt: data.toISOString(),
        isDeleted: 0,
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((folderCreateResponse) => {
      console.log(folderCreateResponse);
      listFolders();
    });
  } catch (err) {
    console.log(err);
  }
}

//listing forlers on dashboard
function listFolders() {
  try {
    var create = document.getElementById("create");
    create.innerHTML = "";
    fetch(`http://localhost:57719/api/Folder/` + sessionStorage.getItem("id"), {
      method: "GET",
    })
      .then((response) => response.json())
      .then((folders) => {
        console.log(folders);
        folders.forEach((folder) => {
          var create = document.getElementById("create");
          var art = document.createElement("article");
          const fold = folder.folderName;
          const fid = folder.folderId;
          console.log(folder.folderCreatedAt);
          console.log(fid);
          art.innerHTML = `<div class="folderBox">
      <div class="infoIcon">
      <img src= "info.png" type="button" class="btn " data-bs-toggle="modal" data-bs-target="#exampleModal" style="position:relative;left: 233px;bottom: 20px; font-size: 15px;  height:35px; weigth:18px;" onclick='viewdetails(${fid})'></i>
      </div>
      <div class="favIcon">
      <img src="love.png" onclick="favorite(${fid})" style="position:relative;left: 10px;bottom: 52px; height:18px; weigth:18px;">
      </div>
      <div class="trashIcon">
      <i class='bx bx-trash' onclick="danger(${fid})" style="position:relative;left: 270px;bottom: 74px; height:26px;">
      </i>
      </div>
      <div class="folderIcon">
      <img src="data-storage.png" onclick="createfiles(${fid}) " style="position:relative; left: 96px; bottom: 80px;">
      </div>
      <button id="filebtn"  onclick ="createfiles(${fid})" style="left:100px; bottom:60px;"> ${fold} </button>
       </div> `;

          create.appendChild(art);
        });
      });
  } catch (err) {
    console.log(err);
  }
}

//reload on page refreshing
function onLoad() {
  listFolders();
}
onLoad();

// createfile
function createfiles(folderid) {
  sessionStorage.setItem("folderid", folderid);
  window.location.href = "file.html";
}
function deleteSession() {
  sessionStorage.clear();
  window.location.href = "login.html";
}

//search a folder
function searchitem() {
  try {
    var search = document.getElementById("search");
    console.log(search);
    var create = document.getElementById("create");
    create.innerHTML = "";
    fetch(
      "http://localhost:57719/api/Folder/" +
        sessionStorage.getItem("id") +
        "/" +
        search.value,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((folders) => {
        console.log(folders);
        folders.forEach((folder) => {
          var create = document.getElementById("create");
          var art = document.createElement("article");
          const fold = folder.folderName;
          const fid = folder.folderId;
          console.log(fold);
          art.innerHTML = `<div class="folderBox">
      <div class="infoIcon">
      <img src= "info.png" style="position:relative;left: 233px;bottom: 20px; font-size: 15px;  height:35px; weigth:18px;" onclick='opendetails(${folder.folderId},"${folder.folderName}","${folder.createdBy}",
      "${folder.createdAt}")'></i>
      </div>
      <div class="favIcon">
      <img src="love.png" style="position:relative;left: 10px;bottom: 52px; height:18px; weigth:18px;">
      </div>
      <div class="trashIcon">
      <i class='bx bx-trash' onclick="danger(${fid})" style="position:relative;left: 265px;bottom: 65px;">
      </i>
      </div>
      <div class="folderIcon">
      <img src="data-storage.png" style="position:relative; left: 100px; bottom: 80px;">
      </div>
      <button id="filebtn"  onclick ="createfiles(${fid})"> ${fold} </button>
       </div> `;

          create.appendChild(art);
        });
      });
  } catch (err) {
    console.log(err);
  }
}

//delete alert on delete icon
function danger(fid) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You can undo this from trash!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          "Deleted!",
          "Your file has been deleted.",
          "success",
          sendToTrash(fid)
        );
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          "Cancelled",
          "Your imaginary file is safe :)",
          "error"
        );
      }
    });
}

//favorite
function favorite(folderId) {
  var requestOptions = {
    method: "PUT",
    redirect: "follow",
  };
  fetch(
    "http://localhost:57719/api/Folder/favourite/" + folderId,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      listFiles();
    })
    .catch((error) => console.log("error", error));
}

//Soft delete to trash
function sendToTrash(folderId) {
  var requestOptions = {
    method: "PUT",
    redirect: "follow",
  };
  fetch(
    "http://localhost:57719/api/Folder/SoftDeleted/" + folderId,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      listFolders();
    })
    .catch((error) => console.log("error", error));
}

document.getElementById("admin").innerHTML = sessionStorage.getItem("admin");

// viewdetails
function viewdetails(folderid) {
  const owner = document.getElementById("Owner");
  const foldername = document.getElementById("foldername");
  const createdby = document.getElementById("createdby");
  const folderids = document.getElementById("folderid");
  owner.innerHTML = "Owner: " + sessionStorage.getItem("admin");
  var requestOptions = {
    method: "GET",

    redirect: "follow",
  };

  fetch("http://localhost:57719/api/Folder/details/" + folderid, requestOptions)
    .then((response) => response.json())
    .then((result) =>
      console.log(
        (foldername.innerHTML = "Foldername: " + result.folderName),
        (createdby.innerHTML = "CreatedAt: " + result.folderCreatedAt),
        result,
        (folderids.innerHTML = "FolderId: " + result.folderId)
      )
    )
    .catch((error) => console.log("error", error));
}
