const onePageMenuss = ['home', 'about-us']
let ignoreScrollEvents = false;
let lastScrollTop = 0; // 이전 스크롤 위치 

let scrollEventTimeout;
let ignoreScrollTimeout;

function checkMobileVersion() {
  const windowWidth = $(window).width()
  if (windowWidth > 800) {
    return false
  }
  return true
}

function scrollTo(target) {
  if (!['home', 'about-us'].includes(target)) {
    return console.error('target error')
  }
  scrolling(`#${target}`)
  deActivateMenu('div.navigation a.active')
  activateMenu(`div.navigation a.${target}`)
}

function scrollInHomePage() {
  const activatedMenu = $('div.navigation a.active')

  const currentScrollTop = window.scrollY || window.pageYOffset;


  if (currentScrollTop > lastScrollTop) { // scroll 내리는 중
    scrollTo('about-us')
  }
  else {
    scrollTo('home')
  }

  lastScrollTop = currentScrollTop
}

function debounce(func, wait) {
  return function() {
    clearTimeout(scrollEventTimeout);
    scrollEventTimeout = setTimeout(func, wait);
  };
}

const debouncedHandleScroll = debounce(function() {
  const isLoadedHome = $('#content-area div.home-area')
  const activatedMenu = $('div.navigation a.active')
  const isHomePage = onePageMenuss.some(menuName => activatedMenu.hasClass(menuName))
  const isMobileVersion = checkMobileVersion()
  if (!isHomePage || ignoreScrollEvents || isMobileVersion || !isLoadedHome) {
    return 
  }
  scrollInHomePage();
}, 20);

function deActivateMenu(activeMenus) {
  $(activeMenus).removeClass('active')
}

function activateMenu(element) {
  // logo 클릭한 경우
  if (element == document.querySelector('a.logo.main')) {
    return $('div.navigation a.home, div.m-navigation a.home').addClass('active');
  }
  
  return $(element).addClass('active');
}


function scrolling(obj){
  const speed = 500;
  if (!obj){  // 예외처리, 현재는 기능적으로 필요한 부분은 아님, 관례적 사용
      $('html, body').animate({scrollTop:0}, speed);
  }else{
      const posTop = $(obj)?.offset()?.top;   // posTop = 매개변수로 들어온 컨텐츠 obj 의 offset().top - 네비게이션 높이
      if (posTop === undefined) {
        return 
      }
      $('html, body').animate({scrollTop:posTop}, speed) // body의 스크롤이동 : posTop
  }
};

// nav - lang active
$(document).ready(function () {
	$(document).on('click', '.lang', function (e) {
		e.preventDefault();
		e.stopPropagation();

		$('.lang').removeClass('active');
		$(this).addClass('active');
	});
});

function checkHomeOrAboutUsActivated() {
  const activatedMenu = $('div.navigation a.active')
  const targetMenu = ['home', 'about-us']
  return targetMenu.some(menuName => activatedMenu.hasClass(menuName))
}

function checkMobileTheme() {
  const isMobileVersion = checkMobileVersion()
  const isHomeOrAboutUsPage = checkHomeOrAboutUsActivated()

  if (isMobileVersion || !isHomeOrAboutUsPage) {
    $('.footer').addClass('footer-relative');
  }
  else {
    $('.footer').removeClass('footer-relative');
    if (!$('.m-navigation').hasClass('hide')) {
      $('.m-navigation').addClass('hide');
    }
  }
}



$(document).ready(function () {
	// 기본 페이지 로드
	$('#content-area').load('home.html', function (response, status, xhr) {
		if (status === 'error') {
			console.error('Failed to load default page: ' + xhr.status + ' ' + xhr.statusText);
		} else {
			console.log('Default page (home.html) loaded successfully');
      activateMenu('div.navigation a.home')
      activateMenu('div.m-navigation a.home'); // 모바일 메뉴에서도 홈을 활성화
      $('html, body').animate({scrollTop:0}, 0);
      checkMobileTheme()
		}
	});

  // 이벤트 리스너 추가
  window.addEventListener('scroll', debouncedHandleScroll);

	function handleMenuClick(e) {
		e.preventDefault();

		const page = $(this).attr('href');

    const invertedMenuNames = ['service', 'xdk', 'news'];
    const isInvertedMenu = invertedMenuNames.some(menuName => $(this).hasClass(menuName))

    deActivateMenu('div.navigation a.active');
    deActivateMenu('div.m-navigation a.active');
    const activatedMenu = activateMenu(this)

    const themeGroup = [
      [$('.top-nav'), 'disable-menu'],
			[$('.footer'), 'footer-relative'],
			[$('.navigation'), 'inverted'],
			[$('.sub-nav'), 'inverted'],
			[$('.wrap-top .logo'), 'inverted'],
			[$('.mobile-menu'), 'inverted'],
    ]

		if (isInvertedMenu) {
			$('.home-area').hide();
			$('#content-area').load(page, function (response, status, xhr) {
				if (status === 'error') {
					console.error('Failed to load page: ' + xhr.status + ' ' + xhr.statusText);
				} else {
          $('html, body').animate({scrollTop:0}, 0);
					console.log('Page loaded successfully');

					// news.html이 로드된 후 .news-more 클릭 이벤트 설정
					if (page === 'news.html') {
						$(document).on('click', '.news-more', function (e) {
							e.preventDefault();
							$('#content-area').load('news_page.html', function (response, status, xhr) {
								if (status === 'error') {
									console.error('Failed to load page: ' + xhr.status + ' ' + xhr.statusText);
								} else {
									console.log('news_page.html loaded successfully');
								}
							});
						});
					}
      //      if (page === 'xdk.html') {
      //   initializeXdk();
      // }
				}
			});
		} else {
			$('.home-area').show();
			$('#content-area').load(page, function (response, status, xhr) {
				if (status === 'error') {
					console.error('Failed to load page: ' + xhr.status + ' ' + xhr.statusText);
				} else {
					console.log('Page loaded successfully');
          
          clearTimeout(ignoreScrollTimeout);
          ignoreScrollEvents = true
          
          const direction = activatedMenu.hasClass('home') ? '#home' : '#about-us';
      
          scrolling(direction)
    
          
          ignoreScrollTimeout = setTimeout(function() {
            ignoreScrollEvents = false;
          }, 1000);
				}
			});
		}
    

    themeGroup.forEach((theme) => {
      const [element, className] = theme
      if (isInvertedMenu) {
        element.addClass(className)
      }
      else { 
        element.removeClass(className)
      }
    })


		if (!$('.m-navigation').hasClass('hide')) {
			$('.m-navigation').addClass('hide');
		}
	}

	// 메뉴 클릭 이벤트 등록
	$(document).on('click', '.navigation a, .m-navigation a, .logo', handleMenuClick);

	// 모바일 메뉴 토글
	$('.mobile-menu').on('click', function () {
		$('.m-navigation').toggleClass('hide');
	});
  $('.m-nav-close').on('click', function () {
		$('.m-navigation').addClass('hide');
});

	$(window).resize(checkMobileTheme);
});

