 //counter
 const element=document.querySelector("#counter");
 const attendance=element.innerText;

 var project = setInterval(projectDone,30);
 var count=1;

 function projectDone(){

    if(isNaN(attendance)){
        clearInterval(project);
        element.innerText='0%';
        return;
    }

     count++;
     element.innerHTML=`${count}%`;

     //stop
     if(count===parseInt(attendance))
     clearInterval(project);

 }

 //date
 var today=new Date();
//  console.log(today);

 var options = {
     weekday: "long",
     day: "numeric",
     month: "long"
 }

 document.querySelector("#today").innerText=today.toLocaleDateString("en-US", options);