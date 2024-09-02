

$(document).ready(function() {
  // PC용 설정 (너비 1201px 이상)
  const elementsToShowPC = [
    { element: '.mt-one', showAt: 300, animationClass: 'show' },
    { element: '.mt-one', showAt: 350, animationClass: 'slide-top' },
    { element: '.mt-two', showAt: 400, animationClass: 'show' },
    { element: '.mt-two', showAt: 450, animationClass: 'slide-top' },
    { element: '.mt-three', showAt: 500, animationClass: 'show' },
    { element: '.mt-three', showAt: 550, animationClass: 'slide-top' },
    { element: '.xdk-sub-title', showAt: 1400, animationClass: 'show' },
    { element: '.xdk-sub-title', showAt: 1450, animationClass: 'slide-top' },
    { element: '.li-one', showAt: 2100, animationClass: 'show' },
    { element: '.li-one', showAt: 2150, animationClass: 'slide-top' },
    { element: '.li-two', showAt: 3200, animationClass: 'show' },
    { element: '.li-two', showAt: 3250, animationClass: 'slide-top' },
    { element: '.li-three', showAt: 4400, animationClass: 'show' },
    { element: '.li-three', showAt: 4450, animationClass: 'slide-top' },
    { element: '.li-four', showAt: 5500, animationClass: 'show' },
    { element: '.li-four', showAt: 5550, animationClass: 'slide-top' },
    { element: '.xdk-bottom-img', showAt: 6600, animationClass: 'show' },
    { element: '.xdk-ab-box', showAt: 7500, animationClass: 'show' },
    { element: '.xdk-ab-box', showAt: 7550, animationClass: 'slide-top1' },
    { element: '.xdk-page2 h2', showAt: 8000, animationClass: 'slide-top' },
  ];

  // 태블릿용 설정 (너비 801px ~ 1200px)
  const elementsToShowTablet = [
    { element: '.mt-one', showAt: 450, animationClass: 'show' },
    { element: '.mt-one', showAt: 500, animationClass: 'slide-top' },
    { element: '.mt-two', showAt: 550, animationClass: 'show' },
    { element: '.mt-two', showAt: 600, animationClass: 'slide-top' },
    { element: '.mt-three', showAt: 650, animationClass: 'show' },
    { element: '.mt-three', showAt: 700, animationClass: 'slide-top' },
    { element: '.xdk-sub-title', showAt: 1200, animationClass: 'show' },
    { element: '.xdk-sub-title', showAt: 1250, animationClass: 'slide-top' },
    { element: '.li-one', showAt: 1850, animationClass: 'show' },
    { element: '.li-one', showAt: 1900, animationClass: 'slide-top' },
    { element: '.li-two', showAt: 2850, animationClass: 'show' },
    { element: '.li-two', showAt: 2900, animationClass: 'slide-top' },
    { element: '.li-three', showAt: 3900, animationClass: 'show' },
    { element: '.li-three', showAt: 3950, animationClass: 'slide-top' },
    { element: '.li-four', showAt: 4900, animationClass: 'show' },
    { element: '.li-four', showAt: 4950, animationClass: 'slide-top' },
    { element: '.xdk-bottom-img', showAt: 5600, animationClass: 'show' },
    { element: '.xdk-ab-box', showAt: 6300, animationClass: 'show' },
    { element: '.xdk-ab-box', showAt: 6350, animationClass: 'slide-top1' },
    { element: '.xdk-page2 h2', showAt: 6700, animationClass: 'slide-top' },
  ];

  // 모바일용 설정 (너비 800px 이하)
  const elementsToShowMobile = [
    { element: '.mt-one', showAt: 150, animationClass: 'show' },
    { element: '.mt-one', showAt: 200, animationClass: 'slide-top' },
    { element: '.mt-two', showAt: 250, animationClass: 'show' },
    { element: '.mt-two', showAt: 300, animationClass: 'slide-top' },
    { element: '.mt-three', showAt: 350, animationClass: 'show' },
    { element: '.mt-three', showAt: 400, animationClass: 'slide-top' },
    { element: '.xdk-sub-title', showAt: 900, animationClass: 'show' },
    { element: '.xdk-sub-title', showAt: 950, animationClass: 'slide-top' },
    { element: '.li-one', showAt: 1800, animationClass: 'show' },
    { element: '.li-one', showAt: 1850, animationClass: 'slide-top' },
    { element: '.li-two', showAt: 2900, animationClass: 'show' },
    { element: '.li-two', showAt: 2950, animationClass: 'slide-top' },
    { element: '.li-three', showAt: 3800, animationClass: 'show' },
    { element: '.li-three', showAt: 3850, animationClass: 'slide-top' },
    { element: '.li-four', showAt: 4850, animationClass: 'show' },
    { element: '.li-four', showAt: 4900, animationClass: 'slide-top' },
    { element: '.xdk-bottom-img', showAt: 5300, animationClass: 'show' },
    { element: '.xdk-ab-box', showAt: 5750, animationClass: 'show' },
    { element: '.xdk-ab-box', showAt: 5800, animationClass: 'slide-top1' },
    { element: '.xdk-page2 h2', showAt: 6400, animationClass: 'slide-top' },
  ];

  // 모바일용 설정 (너비 500px 이하)
  const elementsToShowSmallMobile = [
    { element: '.mt-one', showAt: 150, animationClass: 'show' },
    { element: '.mt-one', showAt: 200, animationClass: 'slide-top' },
    { element: '.mt-two', showAt: 250, animationClass: 'show' },
    { element: '.mt-two', showAt: 300, animationClass: 'slide-top' },
    { element: '.mt-three', showAt: 350, animationClass: 'show' },
    { element: '.mt-three', showAt: 400, animationClass: 'slide-top' },
    { element: '.xdk-sub-title', showAt: 950, animationClass: 'show' },
    { element: '.xdk-sub-title', showAt: 1000, animationClass: 'slide-top' },
    { element: '.li-one', showAt: 1500, animationClass: 'show' },
    { element: '.li-one', showAt: 1550, animationClass: 'slide-top' },
    { element: '.li-two', showAt: 2700, animationClass: 'show' },
    { element: '.li-two', showAt: 2750, animationClass: 'slide-top' },
    { element: '.li-three', showAt: 4150, animationClass: 'show' },
    { element: '.li-three', showAt: 4200, animationClass: 'slide-top' },
    { element: '.li-four', showAt: 5300, animationClass: 'show' },
    { element: '.li-four', showAt: 5350, animationClass: 'slide-top' },
    { element: '.xdk-bottom-img', showAt: 6090, animationClass: 'show' },
    { element: '.xdk-ab-box', showAt: 6500, animationClass: 'show' },
    { element: '.xdk-ab-box', showAt: 6550, animationClass: 'slide-top1' },
    { element: '.xdk-page2 h2', showAt: 6970, animationClass: 'slide-top' },
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
    const windowWidth = $(window).width();
    let elementsToShow;

    if (windowWidth > 1200) {
      elementsToShow = elementsToShowPC;
    } else if (windowWidth > 800) {
      elementsToShow = elementsToShowTablet;
    } else if (windowWidth > 500){
      elementsToShow = elementsToShowMobile;
    } else {
      elementsToShow = elementsToShowSmallMobile;
    }

    $(window).off('scroll'); // 이전 스크롤 핸들러 제거
    $(window).on('scroll', () => handleScroll(elementsToShow));
    handleScroll(elementsToShow);
  }

  $(window).on('resize', applyScrollHandler);
  applyScrollHandler(); // 초기 로드 시 실행

  // 콘솔에 스크롤 높이값 출력
  $(window).on('scroll', function() {
    console.log('Scroll position:', $(window).scrollTop());
  });
});

