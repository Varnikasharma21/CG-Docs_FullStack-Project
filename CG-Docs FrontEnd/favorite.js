document.getElementById("admin").innerHTML = sessionStorage.getItem("admin");
function onLoad() {
  listFolders();
}

onLoad();

//list all favorite folder
function listFolders() {
  try {
    var create = document.getElementById("create");
    create.innerHTML = "";
    fetch(
      `http://localhost:57719/api/Folder/favourite/` +
        sessionStorage.getItem("id"),
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
          console.log(fid);
          art.innerHTML = `<div class="folderBox">
          <div class="infoIcon">
          <img src= "info.png"  type="button" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal" style="position:relative;left: 227px;bottom: 20px; height:34px; weigth:18px;" onclick='viewdetails(${fid})'>
          </i>
          </div>
          <div class="favIcon">
          <img src="love.png" onclick="unfavorite(${fid})" style="position:relative;left: 10px;bottom: 50px; height:18px; weigth:18px;">
          </div>
          <div class="trashIcon">
          <i class='bx bx-trash' onclick="sendToTrash(${fid})" style="position:relative;left: 265px;bottom: 72px;">
          </i>
          </div>
          <div class="folderIcon">
          <img src="data-storage.png" onclick="createfiles(${fid}) " style="position:relative; left: 96px; bottom: 80px;">
          </div>
          <button id="filebtn"  onclick ="createfiles(${fid})" style="left:100px;"> ${fold} </button>
           </div> `;

          create.appendChild(art);
        });
      });
  } catch (err) {
    console.log(err);
  }
}

// unfavorite a folder
function unfavorite(folder) {
  var raw = "";
  var requestOptions = {
    method: "PUT",
    body: raw,
    redirect: "follow",
  };
  let deleteurl = "http://localhost:57719/api/Folder/Removefav/" + folder;
  fetch(deleteurl, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(listFolders()))
    .catch((error) => console.log("error", error));
}

//search in favorite
function searchitem() {
  try {
    var search = document.getElementById("search");
    console.log(search);
    var create = document.getElementById("create");
    create.innerHTML = "";
    fetch(
      "http://localhost:57719/api/Folder/FavoriteSearch/" +
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
        <img src= "info.png" style="position:relative;left: 240px;bottom: 17px; height:22px; weigth:18px;" onclick='opendetails(${folder.folderId},"${folder.folderName}","${folder.createdBy}",
        "${folder.createdAt}")'></i>
        </div>
        <div class="favIcon">
        <img src="love.png" style="position:relative;left: 10px;bottom: 40px; height:18px; weigth:18px;">
        </div>
        <div class="trashIcon">
        <i class='bx bx-trash' onclick="sendToTrash(${fid})" style="position:relative;left: 265px;bottom: 65px; height:22px;">
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
