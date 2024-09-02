$(document).ready(function () {


    $('.tabList > li').on({
        "click": function () {
            let idx = $(this).index();

            $(this).addClass('active').siblings('li').removeClass('active');
            $(this).closest('.tabNav').siblings('.tabCont').eq(idx).addClass('active').siblings('.tabCont').removeClass('active');
            $(this).closest('.tabNav').siblings('.tableArea').eq(idx).addClass('active').siblings('.tableArea').removeClass('active');

        }
    })


    // join
    $(".join").on("click", function(){
        $(".popup.type02").addClass("active");
    })
    $(".popup.type02 .close").on("click", function(){
		$(this).closest(".popup").find('input').val('');
		$(this).closest(".popup").find('input:checkbox').prop('checked',false);
        $(this).closest(".popup").removeClass("active");
    })

    // web 아이디/비밀번호찾기
    $(".findAll").on("click", function(){
        $(".findpwd").addClass("active");
    })
    $(".findpwd .close").on("click", function(){
		$(this).closest(".popup").find('input').val('');//기존 내역 지우기
        $(this).closest(".popup").removeClass("active");
    })

	$(".popupinfoBtn").on("click", function(){
        $(".popupinfo").addClass("active");
    })
	
    $(".popupinfo .close").on("click", function(){
		$(this).closest(".popup").find('input').val('');//기존 내역 지우기
        $(this).closest(".popup").removeClass("active");
    })
})

