window.onresize = function(){
	resize();
}

function resize(){
	//html:20px: 16rem 320px
	//html:40px: 16rem 640px
	var base = 16;//rem

	var wid = $(window).width();
	var hei = $(window).height();
	if(hei < 460){
		$('html').css('font-size', '18px');
		return;
	}
	if(wid < 320){
		$('html').css('font-size', '20px');
		return;
	}
	if(wid > 640){
		$('html').css('font-size', '40px');
		return;
	}
	$('html').css('font-size', wid/16 + 'px');
}
resize();