//listion all the soft deleted folders
function listFolders() {
  try {
    var create = document.getElementById("create");
    create.innerHTML = "";
    fetch(
      `http://localhost:57719/api/Folder/Trash/` + sessionStorage.getItem("id"),
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
          // fold.style.backgroundColor = "red";
          console.log(fid);
          art.innerHTML = `<div class="folderBox">
      <div class="infoIcon">
      <i class="fa-solid fa-circle-info" type="button" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal"  style="position:relative;left: 210px;bottom: 15px;" onclick='viewdetails(${fid})'></i>
      </div>
      <div class="favIcon">
      <img src="love.png"  style="position:relative;left: 237px;bottom: 40px; height:18px; weigth:18px;">
      </div>
      <div class="dotIcon">
      <i class='bx bx-trash' onclick="danger(${fid})" style="position:relative;left: 265px;bottom: 65px;">
      </i>
      </div>
      <div class="folderIcon">
      <img src="data-storage.png" style="position:relative; left: 100px; bottom: 80px;">
      </div>
      <button id="filebtn"  onclick ="createfiles(${fid})" style="left:100px;"> ${fold} </button>
      <div class="undelete">
      <img src="back.png"  onclick="undelete(${fid})" style="position:relative;left:10px;bottom: 184px; height:24px; weigth:18px;">
      </div>
       </div>`;

          create.appendChild(art);
        });
      });
  } catch (err) {
    console.log(err);
  }
}

function onLoad() {
  listFolders();
  document.getElementById("admin").innerHTML = sessionStorage.getItem("admin");
}

onLoad();

//hard delete folder
function deletefolder(folder) {
  var raw = "";
  var requestOptions = {
    method: "DELETE",
    body: raw,
    redirect: "follow",
  };
  let deleteurl = "http://localhost:57719/api/Folder/" + folder;
  fetch(deleteurl, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(listFolders()))
    .catch((error) => console.log("error", error));
}

// undelete folder
function undelete(folder) {
  var raw = "";
  var requestOptions = {
    method: "PUT",
    body: raw,
    redirect: "follow",
  };
  let deleteurl = "http://localhost:57719/api/Folder/Undelete/" + folder;
  fetch(deleteurl, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(listFolders()))
    .catch((error) => console.log("error", error));
}


//details of folder/file
const userid = sessionStorage.getItem("id");
var data = new Date();
function opendetails(folderid, foldername, createdby, createdat) {
  alert(
    "FolderId : " +
      folderid +
      "\n" +
      "Folder Name :" +
      foldername +
      "\n" +
      "Created By : " +
      userid +
      "\n" +
      "Created At : " +
      data.toISOString() +
      "\n"
  );
}

//Searching an item in trash
function searchitem() {
  debugger;
  try {
    var search = document.getElementById("search");
    console.log(search);
    var create = document.getElementById("create");
    create.innerHTML = "";
    fetch(
      "http://localhost:57719/api/Folder/trashSearch/" +
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
          const fid = folder.folderId;
          const fold = folder.folderName;
          // fold.style.backgroundColor = "red";
          console.log(fold);
          art.innerHTML = `<div class="folderBox">
      <div class="infoIcon">
      <img src= "info.png" style="position:relative;left: 208px;bottom: 15px; height:22px; weigth:18px;" onclick='opendetails(${folder.folderId},"${folder.folderName}","${folder.createdBy}",
      "${folder.createdAt}")'></i>
      </div>
      <div class="favIcon">
      <img src="love.png" style="position:relative;left: 237px;bottom: 40px; height:18px; weigth:18px;">
      </div>
      <div class="trashIcon">
      <i class='bx bx-trash' onclick="sendToTrash(${fid})" style="position:relative;left: 265px;bottom: 65px;">
      </i>
      </div>
      <div class="folderIcon">
      <img src="data-storage.png" style="position:relative; left: 100px; bottom: 80px;">
      </div>
      <button id="filebtn"  onclick ="createfiles(${fid})"> ${fold} </button>
      <div class="undelete">
      <img src="back.png"  onclick="undelete(${fid})" style="position:relative;left:10px;bottom: 184px; height:24px; weigth:18px;">
      </div>
       </div> `;
          create.appendChild(art);
        });
      });
  } catch (err) {
    console.log(err);
  }
}


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
          deletefolder(fid)
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


document.getElementById("admin").innerHTML=sessionStorage.getItem("admin");





