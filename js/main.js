
var musicList = []
var currentIndex = 0
var clock
var lastIndex = 0
var audio = new Audio()
audio.autoplay = true



getMusicList(function(list){
  musicList = list
  loadMusic(list[currentIndex])
  createlist(list)
})
function $(selector){
  return document.querySelector(selector)
}

function getMusicList(callback){
  var xhr = new XMLHttpRequest()
  xhr.open('GET','https://erdoszrf.github.io/EasyMusic/music.json',true)
  xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304){
      callback(JSON.parse(this.responseText))
    }else{
      console.log('获取失败')
    }
  }
  xhr.onerror = function(){
    console.log('服务器异常')
  }
  xhr.send()
}
function loadMusic(musicObj){
  $('.boxtop .info .title').innerText = musicObj.title
  $('.boxtop .info .singer').innerText = musicObj.singer
  $('.bgimg').style.backgroundImage = 'url('+musicObj.img+')'
  audio.src = musicObj.src
  $('.play').classList.remove('icon-play')
  $('.play').classList.add('icon-pause')
  $('.bgimg').classList.add('rotate')
}
$('.icon-prev').onclick = function(){
  currentIndex = (musicList.length + --currentIndex) % musicList.length
  loadMusic(musicList[currentIndex])
}
$('.icon-next').onclick = function(){
  currentIndex = (musicList.length + currentIndex+1) % musicList.length
  loadMusic(musicList[currentIndex])
}
$('.play').onclick = function(){
  if(audio.paused){
    $('.play').classList.remove('icon-play')
    $('.play').classList.add('icon-pause')
    $('.bgimg').classList.add('rotate')
    $('.bgimg').style.animationPlayState = 'running'
    audio.play()
  }else{
    $('.play').classList.remove('icon-pause')
    $('.play').classList.add('icon-play')
    
    $('.bgimg').style.animationPlayState = 'paused'
    audio.pause()
  }
}
audio.ontimeupdate = function(){
  $('.boxbottom .progressnow').style.width = (this.currentTime/this.duration)*100+'%'

}
audio.onplay = function(){
  clock = setInterval(function(){
    var min = Math.floor(audio.currentTime/60)
    var sec = Math.floor(audio.currentTime%60)+''
    sec = sec.length === 2?sec:'0'+sec
    $('.boxbottom .time').innerText = min+':'+sec
  },1000)
  aa = document.querySelectorAll('li')
  aa[lastIndex].classList.remove('active')
  aa[currentIndex].classList.add('active')
  lastIndex = currentIndex
  $('.bgimg').style.animationPlayState = 'running'
}
audio.onpause = function(){
  clearInterval(clock)
  
  
}
audio.onended= function(){
  currentIndex = (musicList.length + currentIndex+1) % musicList.length
  loadMusic(musicList[currentIndex])
}

$('.boxbottom .bar').onclick = function(e){
  var percent = e.offsetX/parseInt(getComputedStyle(this).width)
  audio.currentTime = audio.duration * percent
}
function createlist(list){
  var ul = $('.musiclist ul')
  for(var n in list){
    var childli = document.createElement('li')
    var span = document.createElement('span')
    var text = document.createTextNode(list[n].title)
    span.appendChild(text)
    childli.appendChild(span)
    ul.appendChild(childli)
  }
}
$('.musiclist ul').addEventListener('click',function(e){


for(var i = 0;i<musicList.length;i++){
    if(musicList[i].title === e.target.innerText){
      currentIndex = i
      loadMusic(musicList[currentIndex])
    }
}
})

