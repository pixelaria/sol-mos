
$(function (){
  console.log('init 0.1');
  
  $('#nav-toggler').click(function(e){
    var target = $(this).data('target');
    console.log('qweqwe',target);
    $('#'+target).toggleClass('nav__list--active');
  });  

});

