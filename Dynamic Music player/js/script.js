console.log("Welcome to javascript");
let currfolder;
let songs;
let currentsong = new Audio();
let songry;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
//Getting Album name and Description
async function getAlbum() {
    let getAlbum = await fetch('/songs/');
    let data = await getAlbum.text();
    let div = document.createElement("div");
    div.innerHTML = data;
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors);
    let cardcontainer = document.querySelector(".cardcontainer");
    for (let i = 1; i < array.length; i++) {
        const e = array[i];
        folder = e.href.split("/").slice(-2)[0];
        let desct = await fetch(`/songs/${folder}/info/info.json`);
        let descdat = await desct.json();
        let picture = `/songs/${folder}/image/cover.jpg`;
        cardcontainer.innerHTML += ` <div class="card" data-folder="${folder}">
        <div class="cover"><img src=${picture} alt=""></div>  
        <div class="context">${folder.replaceAll("%20"," ")}</div>
        <div class="desc">${descdat.desc}</div>
       <img class="hoverbutton" src="/Images/hoverplay.svg" alt="">
      </div>`;
    }
    
    Array.from(document.getElementsByClassName("card")).forEach(o => {
        o.addEventListener("click", async items => {
            let folder = items.currentTarget.dataset.folder;
            
            getsongname(`${folder}`);
            
            
          
        });
    });
}


async function getsongname(folder) {
    currfolder = folder;
    let songname = await fetch(`/songs/${folder}`);
    let songdata = await songname.text();
    let sung = document.createElement("div")
    sung.innerHTML=songdata;
    anchor = sung.getElementsByTagName("a")
    let songarray = Array.from(anchor);
    songs =[]
    songry=[]
    for (let i = 3; i < songarray.length; i++) {
        const ele = songarray[i];
        songs.push(ele.href)
       songry.push(ele.href.split("/").slice(-1)[0])
       
    }
    
    
   let songlists = document.getElementById("lists")
   songlists.innerHTML=""
   for (const h of songs) {
    songlists.innerHTML = songlists.innerHTML +  `<li > <div class="fit"><img src="/songs/${currfolder}/image/cover.jpg" alt=""></div><div class="info"> ${h.split("/").slice(-1)[0].replaceAll("%20"," ").trim()}</div> <div class="fit"><img src="/Images/play.svg" alt=""></div></li> `
   } 
   Array.from(document.getElementsByTagName("li")).forEach(p =>{
    p.addEventListener("click",songop=>{
        playMusic(p.querySelector(".info").innerHTML.replaceAll(" ","%20"))
    })
   })
   return {songs , songry} ;  
   
}

const playMusic = (track, pause = false) => {
    currentsong.src =  `/songs/${currfolder}/`+ track.replace("%20","")
    
    if (!pause) {
        currentsong.play();
       play.src="/Images/pause.svg" 
    }
    document.querySelector(".songname").innerHTML = `${track.split("/").slice(-1)[0].replaceAll("%20"," ")}`
    document.querySelector(".time").innerHTML="00:00/00:00" 
    
}
const playMus = (track, pause = false) => {
    currentsong.src =  `/songs/${currfolder}/`+ track
    
    if (!pause) {
        currentsong.play();
       play.src="/Images/pause.svg" 
    }
    document.querySelector(".songname").innerHTML = `${track.split("/").slice(-1)[0].replaceAll("%20"," ")}`
    document.querySelector(".time").innerHTML="00:00/00:00" 
}

function main(){
getAlbum();
getsongname();
  //get the time of the track
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".time").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".roll").style.left = (currentsong.currentTime / currentsong.duration) * 99 + "%";
})
//play pause button
play.addEventListener("click", () => {
    if (currentsong.paused) {
        currentsong.play()
        play.src = "Images/pause.svg"
    }
    else {
        currentsong.pause()
        play.src = "Images/play.svg"
    }
})
//play next song
next.addEventListener("click",()=>{
     currentsong.pause()
     console.log("next click")
     let index = songs.indexOf(currentsong.src)
     
     if(index<songs.length){
        index+=1
     playMus(songry[index])
     }
     
})
//play previous song
previous.addEventListener("click",()=>{
    currentsong.pause()
    
    let index = songs.indexOf(currentsong.src)
    if(index>0){
       index-=1
    playMus(songry[index])
    }
    
})
//seekbar
document.querySelector(".seekbar").addEventListener("click",(e=>{
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".roll").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100
})
)
//volumebutton
document.querySelector(".range").addEventListener("click",(f=>{
    currentsong.volume=parseInt(f.target.value)/100
    if(currentsong.volume>0){
    document.getElementById("mute").src = document.getElementById("mute").src.replace("/Images/mute.svg","/Images/volume.svg")
       
    }

}))
//mute button
document.getElementById("mute").addEventListener("click",(g=>{
    if(currentsong.volume>0){
       
        currentsong.volume=0;
        document.querySelector(".range").value=0;
    document.getElementById("mute").src = document.getElementById("mute").src.replace("/Images/volume.svg","/Images/mute.svg")
    }
    else{
        currentsong.volume=0.10;
        document.querySelector(".range").value=10;
        document.getElementById("mute").src = document.getElementById("mute").src.replace("/Images/mute.svg","/Images/volume.svg")
    }
}))
currentsong.addEventListener("ended",()=>{
    let index = songs.indexOf(currentsong.src)
    if(index>=0){
       index+=1
    playMus(songry[index])
    }

})
document.getElementById("hamburger").addEventListener("click",()=>{
   document.querySelector(".left").style.left= "0%";
})
document.querySelector(".closing").addEventListener("click",()=>{
    document.querySelector(".left").style.left= "-130%";
 })
 



    
}  


main()