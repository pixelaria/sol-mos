function wrdSlider(){
  const root = document;
  const wrdSlider = root.getElementsByClassName('wrd-slider')[0];
  const wrdSliderWrap = wrdSlider.getElementsByClassName('wrd-slider__wrap')[0];
  const slide = wrdSliderWrap.children;
  const slideLength = wrdSliderWrap.children.length;
  const wrdSliderControl = wrdSlider.getElementsByClassName('wrd-slider__control')[0];
  const buttonPrev = wrdSliderControl.getElementsByClassName('button--prev')[0];
  const buttonNext = wrdSliderControl.getElementsByClassName('button--next')[0];

  slide[0].classList.add('active');
  let offestSlider = 0;
  let activeSlide = 0;

  buttonNext.addEventListener('click', function(){

    activeSlide += 1;

    if(activeSlide < slideLength){
      offestSlider += slide[activeSlide].offsetWidth + 50;
      wrdSliderWrap.style.transform = `translate3d(-${offestSlider}px,0,0)`
    }else{
      activeSlide -= 1;
    }

  })

  buttonPrev.addEventListener('click', function(){

    activeSlide -= 1;

    if(activeSlide >= 0){
      offestSlider -= slide[activeSlide].offsetWidth + 50;
      wrdSliderWrap.style.transform = `translate3d(${offestSlider}px,0,0)`
    }else{
      activeSlide += 1;
    }

  })


}

export default wrdSlider
