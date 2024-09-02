//ser-con2 slide-top
$(document).ready(function () {
  const elementsToShow = [
    { element: '.digital-twin-con', showAt: 10, animationClass: 'show' },
    { element: '.digital-twin-con', showAt: 50, animationClass: 'slide-top3' },
  ];

  function handleScroll(elements) {
    const scrollY = $(window).scrollTop();

    elements.forEach(item => {
      const $element = $(item.element);
      if (scrollY > item.showAt) {
        $element.addClass(item.animationClass);
      } else {
        $element.removeClass(item.animationClass);
      }
    });
  }

  function applyScrollHandler() {
    $(window).off('scroll'); 
    $(window).on('scroll', () => handleScroll(elementsToShow));
    handleScroll(elementsToShow);
  }

  $(window).on('resize', applyScrollHandler);
  applyScrollHandler(); 

  // 콘솔에 스크롤 높이값 출력
  // $(window).on('scroll', function () {
  //   console.log('Scroll position:', $(window).scrollTop());
  // });
});

$(document).ready(function() {
  const $slideArea = $('.slide-area');
  const $slides = $('.slide-area .ser-slide');
  const $btns = $('.slide-btn li');
  const $leftBtn = $('.slide-left');
  const $rightBtn = $('.slide-right');
  const slideCount = $slides.length;
  let currentIndex = 0;
  let interval;

  // 슬라이드 복제
  $slides.clone().appendTo($slideArea);

  function calculateSlideWidth() {
    const slideWidth = $slides.outerWidth(true); // 슬라이드 너비 + 마진
    return slideWidth;
  }

  function goToSlide(index) {
    const slideWidth = calculateSlideWidth();
    $slideArea.css('transform', `translateX(${-index * slideWidth}px)`);
    $btns.removeClass('active');
    $btns.eq(index % slideCount).addClass('active');
    currentIndex = index;
  }

  function goToNextSlide() {
    const nextIndex = (currentIndex + 1);
    goToSlide(nextIndex);
    if (nextIndex >= slideCount) {
      setTimeout(() => {
        $slideArea.css('transition', 'none');
        goToSlide(nextIndex % slideCount);
        setTimeout(() => $slideArea.css('transition', ''), 50);
      }, 500);
    }
  }

  function startAutoSlide() {
    interval = setInterval(goToNextSlide, 5000);
  }

  function stopAutoSlide() {
    clearInterval(interval);
  }

  $leftBtn.click(function() {
    const prevIndex = (currentIndex - 1 + slideCount * 2) % (slideCount * 2);
    goToSlide(prevIndex);
  });

  $rightBtn.click(function() {
    const nextIndex = (currentIndex + 1) % (slideCount * 2);
    goToSlide(nextIndex);
  });

  $btns.click(function() {
    const index = $(this).index();
    goToSlide(index);
  });

  $slideArea.on('mouseenter', stopAutoSlide).on('mouseleave', startAutoSlide);

  goToSlide(0);
  startAutoSlide();
});




//ser-con3 슬라이드 이미지 무한루프
$(document).ready(function () {
  const $slideList = $('.con4-img-slide-list');
  const $slides = $slideList.children('li');
  const slideCount = $slides.length;

  // 슬라이드를 복제하여 리스트에 추가
  $slides.each(function () {
    $(this).clone().appendTo($slideList);
  });

  // 슬라이드 리스트의 새 넓이를 설정
  const totalWidth = slideCount * 2 * ($slides.outerWidth(true));
  $slideList.css('width', totalWidth + 'px');

  //슬라이드 동작시작
  function startAnimation() {
    $slideList.css({
      transform: 'translateX(0)',
      transition: 'none'
    });

    setTimeout(() => {
      $slideList.css({
        transform: 'translateX(' + -slideCount * ($slides.outerWidth(true)) + 'px)',
        transition: 'transform 200s linear'
      });
    }, 150);
  }
  $slideList.on('transitionend', startAnimation);

  startAnimation();
});
