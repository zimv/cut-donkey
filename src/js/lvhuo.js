 function preloader(images, cb){
    
    //利用好并行加载
    var i = 0;
    var onComplete = function(e){
    	i++;
    	if(i == images.length){
    		cb && cb();
    	}
    }
    for(j in images) {
    	var img = new Image();
    	img.onload = img.onerror = onComplete;
    	img.src = images[j];
    }
}

var onImgLoaded = function(){
    $(".loading").addClass("hide");
}

//对几张较大图进行预加载,页面相对图片的路径
preloader(["src/img/donkey-light.png","src/img/guide-con.png","src/img/title-2.png","src/img/title-4.png"], onImgLoaded);

$('.guide').on('click', function(){
	$('#overlay-guide').removeClass('hide');
});
$('.share').on('click', function(){
	$('#share').removeClass('hide');
});
$('#share').on('click', function(){
	$(this).addClass('hide');
});

$('.close-btn').on('click', function(){
	$('#overlay-guide').addClass('hide');
});

$('.start').on('click', function(){
	$('#page-1').addClass('hide');
	$('#page-2').removeClass('hide');

	startCut();
});

$('.guide-come').on('click', function(){
	$('#overlay-guide,#page-1').addClass('hide');
	$('#page-2').removeClass('hide');

	startCut();
});

$('.again').on('click', function(){//点击再战一场
	$('#page-4').addClass('hide');
	$('#page-2').removeClass('hide');

	startCut();
});


function startCut(){
	setTimeout(function(){//开始
		$('#page-2').addClass('hide');
		$('#page-3').removeClass('hide');

		cut.init();
	}, 6000);
}
/*$('.donkey-light,.hand').on('click', function(){//点击开始
	$('#page-2').addClass('hide');
	$('#page-3').removeClass('hide');

	cut = new Cut()
	cut.init();
});*/


function Cut(){
}

Cut.prototype = {
	time: 20,
	$timeCon: $('.time'),
	score: '',//得分
	$scoreCon: $('.number'),
	resultPic: ["src/img/first.png", "src/img/second.png", "src/img/third.png", "src/img/lose.png"],
	resultPic2: ["src/img/share-1.png", "src/img/share-2.png", "src/img/share-3.png", "src/img/share-4.png"],
	$x: '',//切的x边缘
	$y: '',//切的y边缘
	last: ["",""],
	swordRotate: ["10","65","90","150","-60","90","-40","120","170"],
	rotateIndex: 0,
	$donkey: $('.donkey'),//倔驴的dom

	init: function(){
		var self = this;
		self.score = 0;
		self.rotateIndex = 0;
		self.last = ["",""];

		self.timer();

		var $offset = self.$donkey.offset();//获取驴的位置和宽度
		self.$x = [$offset.left + $offset.width / 5, $offset.left + $offset.width - $offset.width / 5];//0左1右
		self.$y = [$offset.top + $offset.height / 5, $offset.top + $offset.height - $offset.height / 5];//0上1下

		/*self.$donkey.on('click', function(){
			self.score++;
			self.$scoreCon.html(self.score);
			$('.lian').removeClass('hide');
		});*/
		self.cut();
	},
	timer: function(){//计时器
		var self = this;
		if(self.time == 0){//结束显示结果
			self.showResult();
			return;
		}
		self.$timeCon.html(self.time+ "s");
		self.time--;
		setTimeout(function(){self.timer()},1000)
	},
	showResult: function(){//显示结果
		$('.cut-region').off('touchmove');//取消move绑定
		this.$timeCon.html("");
		this.$scoreCon.html("");
		$('#page-3,.lian').addClass('hide');
		$('#page-4').removeClass('hide');
		
		$('.number-2').html(this.score);
		//设置结果
		if(this.score >= 120){
			changeImg('.result',this.resultPic[0]);
			changeImg('.share-text',this.resultPic2[0]);
			setDiscount(5);
		} 
		if(this.score >= 100 && this.score < 120) {
			changeImg('.result',this.resultPic[1]);
			changeImg('.share-text',this.resultPic2[1]);
			setDiscount(6);
		}
		if(this.score >= 80 && this.score < 100){
			changeImg('.result',this.resultPic[2]);
			changeImg('.share-text',this.resultPic2[2]);
			setDiscount(7);
		} 
		if(this.score < 80) {
			changeImg('.result',this.resultPic[3]);
			changeImg('.share-text',this.resultPic2[3]);
			setDiscount(8);
		}
		function changeImg(dom,src){
			$(dom).attr('src', src);
		}
	},
	cut: function(){
		var self = this,
			$region = $('.cut-region');

		$region.on('touchstart', function(){
			self.$donkey.addClass('shake');
			$region.on('touchmove', function(e){
				e.preventDefault();
				if(self.cutCount(e)){//去计算是否应该算一次
					self.sword();
					self.score++;
					self.$scoreCon.html(self.score);
					$('.lian').removeClass('hide');
					self.last = ["",""];//重置
				}
			});
				
		}).on('touchend', function(){
			self.$donkey.removeClass('shake');
			$region.off('touchmove');
		});
	},
	cutCount: function(e){
		var self = this;
		var loca = e.targetTouches[0];
		if(loca.clientX > self.$x[0] 
			&& loca.clientX < self.$x[1] 
			&& loca.clientY < self.$y[1] 
			&& loca.clientY > self.$y[0]){//在驴身上

				if(self.last[0] == 'in') return false;//上一次同样在里面，不执行

				if(self.last[0] == 'out' && self.last[1] == 'in'){
					self.last[1] = self.last[0];
					self.last[0] = 'in';
					return true;
				}else{
					self.last[1] = self.last[0];
					self.last[0] = 'in';
					return false;
				}
				
		}else{//就在外面

			if(self.last[0] == 'out') return false;//上一次在同样外面，不执行

			if(self.last[0] == 'in' && self.last[1] == 'out'){
				self.last[1] = self.last[0];
				self.last[0] = 'out';
				return true;
			}else{
				self.last[1] = self.last[0];
				self.last[0] = 'out';
				return false;
			}
		}
	
	},
	sword: function(){
		var $sword = $('.sword');
		if(this.rotateIndex >= this.swordRotate.length) this.rotateIndex = 0;
		$sword.css({'-webkit-transform':'rotateX(' + this.swordRotate[this.rotateIndex] +'deg)', 'display': 'block'});
		setTimeout(function(){$sword.css( 'display','none')}, 100);
		this.rotateIndex++;
	}

}
var cut = new Cut();

$(document).on('touchmove', function(e){
	e.preventDefault();
});