
const home = document.getElementById('homeLink');
const about = document.getElementById('aboutUsLink');
const help = document.getElementById('helpLink');

home.addEventListener("click",()=>{
    home.classList.add("active");
    about.classList.remove("active");
    help.classList.remove("active");
});

about.addEventListener("click",()=>{
    home.classList.remove("active");
    about.classList.add("active");
    help.classList.remove("active");
});



help.addEventListener("click",()=>{
    home.classList.remove("active");
    about.classList.remove("active");
    help.classList.add("active");
});

