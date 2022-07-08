function sendData(){

    let user=document.getElementById("userName").value;
    let password=document.getElementById("password").value;
    var curr=new Date();
    var DateTime=curr.getFullYear()+"-"+curr.getMonth()+"-"+curr.getDay()+" "+ curr.getHours() + ":" 
  
    + curr.getMinutes() + ":" + curr.getSeconds();
    console.log(DateTime);
    var request={
  
      method:'POST',
      redirect:'follow',
      body: JSON.stringify({
  
        "username": user,
        "userPassword":password,
        "userCreatedAt": DateTime
      }),    
      headers: { 
        "Content-type": "application/json; charset=UTF-8"
      }
    };
  
    fetch("http://localhost:57719/api/User", request)
    .then(response => response.text())
    .then(result => showNext(result))
    .catch(error => console.log('error', error));}
    function showNext(result){
        console.log(result);
        window.location.href="login.html";
    }