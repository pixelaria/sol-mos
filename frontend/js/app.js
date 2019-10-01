import svgSprite from './inc/svg-sprite';
import wrdSlider from './wrd-slider';

svgSprite(window, document);
wrdSlider()

const easeInCubic = function (t) { return t*t*t }
const scrollToElem = (startTime, currentTime, duration, scrollEndElemTop, startScrollOffset) => {
   const runtime = currentTime - startTime;
   let progress = runtime / duration;
   
   progress = Math.min(progress, 1);
   
   const ease = easeInCubic(progress);
   
   window.scroll(0, startScrollOffset + (scrollEndElemTop * ease));

if(runtime < duration){
     requestAnimationFrame((timestamp) => {
       const currentTime = timestamp || new Date().getTime();
       scrollToElem(startTime, currentTime, duration, scrollEndElemTop, startScrollOffset);
     })
   }
 }

const scrollElems=document.querySelectorAll('.scroll-to-target');

// Now add an event listeners to those element

for(let i = 0; i < scrollElems.length; i++){
  const elem = scrollElems[i];
  
  elem.addEventListener('click',function(e) {
   e.preventDefault();
   
   // 1. Get the element id to which you want to scroll
   const scrollElemId = e.target.href.split('#')[1];
   
   // 2. find that node from the document
   const scrollEndElem = document.getElementById(scrollElemId);
   
   // 3. and well animate to that node.. 
   const anim = requestAnimationFrame((timestamp) => {
     const stamp = timestamp || new Date().getTime();
     const duration = 200;
     const start = stamp;
  
     const startScrollOffset = window.pageYOffset;

     const scrollEndElemTop = scrollEndElem.getBoundingClientRect().top;
  
     scrollToElem(start, stamp, duration, scrollEndElemTop, startScrollOffset);
   })
 })
}
  



$(function (){
  console.log('init 0.1');
  
  $('#nav-toggler').click(function(e){
    var target = $(this).data('target');
    console.log('qweqwe',target);
    $('#'+target).toggleClass('nav__list--active');
  });  

});

