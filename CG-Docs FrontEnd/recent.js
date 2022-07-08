let formname = document.getElementById('file');
  console.log(formname);
  var data=new Date();
const userid=sessionStorage.getItem("id");
  
  //List all recent folders
  function listFolders() {
    try
    {
      var create = document.getElementById("create");
      var date=new Date();
      create.innerHTML = '';
    fetch("http://localhost:57719/api/Folder/Recent/"+sessionStorage.getItem("id")+"/"+date.getHours(), {
      method: 'GET'
    })
    .then(response => response.json())
    .then((folders) => {
      console.log(folders);
      folders.forEach(folder => {
      var create = document.getElementById("create");
      var art = document.createElement("article");
      const fold = folder.folderName;
      const fid=folder.folderId;
      art.innerHTML = 
      `<div class="folderBox">
      <div class="infoIcon">
      <img src= "info.png" type="button" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal" style="position:relative;left: 230px;bottom: 22px; height:34px; weigth:18px;" onclick='viewdetails(${fid})'></i>
      </div>
      <div class="favIcon">
      <img src="love.png" style="position:relative;left: 10px;bottom: 52px; height:18px; weigth:18px;">
      </div>
      <div class="trashIcon">
      <i class='bx bx-trash' onclick="sendToTrash(${fid})" style="position:relative;left: 265px;bottom: 75px;">
      </i>
      </div>
      <div class="folderIcon">
      <img src="data-storage.png" onclick ="createfiles(${fid})" style="position:relative; left: 100px; bottom: 80px;">
      </div>
      <button id="filebtn"  onclick ="createfiles(${fid})"> ${fold} </button>
       </div> `;

      
       
      create.appendChild(art);
      });
    })
    }
    catch(err)
    {
      console.log(err);
    }
  }
  

  function onLoad() {
    listFolders();
  }
  
  onLoad();


  // open files within a folder 
  function createfiles(folderid) {
    sessionStorage.setItem("folderid",folderid);
    window.location.href ="file.html"; 
  }


 function deleteSession(){
sessionStorage.clear();
window.location.href="login.html";
  }



  

//Soft delete to trash
    function sendToTrash(folderId){
    var requestOptions = {
      method: 'PUT',
      redirect: 'follow'
    };
    fetch("http://localhost:57719/api/Folder/SoftDeleted/"+folderId, requestOptions)
      .then(response => response.text())
      .then(result =>{
        console.log(result)
        listFolders()})
      .catch(error => console.log('error', error));
      }


function opendetails(folderid,foldername,createdby,createdat)
{
  alert(
  "FolderId : " +folderid+ "\n"+
  "FolderName :" +foldername + "\n"+
  "FolderCreatedBy : " +userid +"\n"+
  "FolderCreatedAt : " +data.toISOString()+ "\n"
  );
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


document.getElementById("admin").innerHTML=sessionStorage.getItem("admin");





