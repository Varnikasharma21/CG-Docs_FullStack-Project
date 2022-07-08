document.getElementById("admin").innerHTML=sessionStorage.getItem("admin");

  var id=sessionStorage.getItem("id");
  const userid=sessionStorage.getItem("id");
  var folderid=sessionStorage.getItem("folderid");
  var data=new Date();
 
 
var curr=new Date();

 //listing all files
  function listFiles() {
    try
    {
      var create = document.getElementById("create");
      create.innerHTML = '';
    fetch('http://localhost:57719/api/Document/'+folderid)
    .then(response => response.json())
    .then((folders) => {
      
      folders.forEach((folder) => {
    
      var create = document.getElementById("create");
      var art = document.createElement("article");
      
      const fold = folder.documentName;
      const fid=folder.documentId;
      console.log(fold);
    
      art.innerHTML = `<div class="folderBox">
      <div class="infoIcon">
      <img src= "info.png" type="button" class="btn " data-bs-toggle="modal" data-bs-target="#exampleModal" style="position:relative;left: 230px;bottom: 22px; font-size: 15px;  height:35px; weigth:18px;" onclick='viewdetails(${fid})'</i>

      </div>
      <div class="favIcon">
      <img src="love.png" style="position:relative;left: 3px;bottom: 52px; height:18px; weigth:18px;">
      </div>
      <div class="trashIcon">
      <i class="bx bx-trash" onclick="danger(${fid})" style="position:relative;left: 265px;bottom: 75px;">
      </i>
       </div>
       <div class="folderIcon">
      <img src="document.png" style="position:relative; left: 110px; bottom: 80px; height:60px;">
      </div>
       <button id="filebtn" onclick ="createfiles()" style="left:100px; bottom:57px;"> ${fold} </button>
       </div>`;

      create.appendChild(art);
      });
   })
    }
    catch(err)
    {
      console.log(err);
    }
  }


  //reload on page refreshing
  function onLoad() {
    listFiles();
    document.getElementById("admin").innerHTML=sessionStorage.getItem("admin");
  }
  
  onLoad();
  
  //logout redirects to homepage
  function logout() {
    window.location.href = "index.html";
    sessionStorage.clear();
  }

//delete alert
function danger(fid){
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  swalWithBootstrapButtons.fire({
    title: 'Are you sure?',
    text: "You can undo this from trash!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      swalWithBootstrapButtons.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success',
        sendToTrash(fid)
      )
    } else if (
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Cancelled',
        'Your imaginary file is safe :)',
        'error'
      )
    }
  })
}


  //search a file
  function searchitem(){
    try
    {
      var search=document.getElementById("search").value;
      console.log(search);
      var create = document.getElementById("create");
      create.innerHTML = '';
    fetch(`http://localhost:57719/api/Document/${sessionStorage.getItem("id")}/${sessionStorage.getItem("folderid")}/${search}`)
    .then(response => response.json())
    .then((folders) => {
      console.log(folders);
      folders.forEach(folder => {
        // debugger;
      var create = document.getElementById("create");
      var art = document.createElement("article");
      const fold = folder.documentName;
      console.log(fold);
      art.innerHTML = 
      `<i class="fa-solid fa-2x fa-file"></i>
       <a style="font-size:  20px;text-decoration: none;position: relative;left: 190px;bottom: 20px;cursor: pointer;"></a>
      
     <button id="filebtn" onclick ="createfiles()" style="top:20px;"> ${fold} </button>`;
     
      create.appendChild(art);
      });
    })
    
    }
    catch(err)
    {
      console.log(err);
    }
  }



  //Soft delete to trash
  function sendToTrash(folderId){
    var requestOptions = {
      method: 'PUT',
      redirect: 'follow'
    };
    fetch("http://localhost:57719/api/Document/"+folderId, requestOptions)
      .then(response => response.text())
      .then(result =>{
        console.log(result)
        listFiles()})
      .catch(error => console.log('error', error));
      }


//upload a file
var date=new Date();

function chosenfile() {
  let val=form.files[0];
var formdata = new FormData();
formdata.append("files",val);
var requestOptions = {
  method: 'POST',
  body: formdata,
  redirect: 'follow'
};
fetch("http://localhost:57719/api/Document/upload/"+date.toISOString()+"/"+sessionStorage.getItem("id")+"/"+sessionStorage.getItem("folderid"), requestOptions)
  .then(response => response.text())
  .then(result => {
    listFiles();
    console.log(result)
  })
  .catch(error => console.log('error', error));
}


// viewdetails files
function viewdetails(documentid){
  debugger;
  const owner = document.getElementById("Owner");
  const documentname = document.getElementById("documentname");
  const documentids = document.getElementById("fileid");
  const size = document.getElementById("size");
  owner.innerHTML = "Owner: "+ sessionStorage.getItem("admin");

  var requestOptions = {
    method: 'GET',

    redirect: 'follow'
  };
  
  fetch("http://localhost:57719/api/Document/details/"+ documentid, requestOptions)
    .then(response => response.json())
    .then(result => console.log(documentname.innerHTML="documentname: "+result.documentName , result, documentids.innerHTML="Size : "+  result.documentSize, size.innerHTML="CreateAt : " + result.documentCreatedAt))
    .catch(error => console.log('error', error));
}