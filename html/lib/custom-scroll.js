
function CustomScroll(wrap, target, opt = {}){
	var scrollWrap
	,	scrollBar
	,	body = document.getElementsByTagName('body')[0]
	,	mouseDownPos
	,	scrollEvent = true
	,	scrollSize
	,	scrollStyle = 'scrollHeight'
	,	style = 'height'
	,	scrollDirection = 'scrollTop'
	,	styleDirection = 'top'
	,	offsetDirection = 'offsetTop'
	,	screenDirection = 'screenY'
	,	clientStyle = 'clientHeight'
	,	ratio
	,	opacityTimer
	;

	if(opt.overflow == 'x'){
		scrollStyle = 'scrollWidth';
		style = 'width';
		scrollDirection = 'scrollLeft';
		styleDirection = 'left';
		offsetDirection = 'offsetLeft';
		screenDirection = 'screenX';
		clientStyle = 'clientWidth';
	}

	function makeScrollBar(){
		var wrap = document.createElement('div')
		;
		wrap.classList.add('custom-scrollWrap');
		if(clientStyle == 'clientWidth') wrap.classList.add('overflow-x');
		wrap.innerHTML = "<div class='bar'></div>"

		return wrap;
	}

	function makeWrap () {
		var targetWidth = 0
		,	overflowTarget = opt.overflowTarget || target
		;
		overflowTarget.removeAttribute('style');

		for(var i=0; i<overflowTarget.children.length; i++){
			targetWidth += overflowTarget.children[i].clientWidth;
		}

		overflowTarget.style.width = targetWidth + 'px';

		return targetWidth;
	}

	function scrollBarSize(){
		var size = Math.floor((wrap[clientStyle] / target[scrollStyle]) * wrap[clientStyle]);
		if(size < 50) size = 50;
		return  size;
	}

	function getScrollSize(){
		return wrap[clientStyle] - scrollBarSize();
	}

	function moveBar(loc, disable){
		this.style.opacity = 1;
		clearTimeout(opacityTimer);
		opacityTimer = setTimeout(function(){
			scrollBar.style.opacity = '';	
		}, 500);
		this.style[styleDirection] = loc+ "px";	
	}

	function mouseMove(){
		var top = scrollBar[offsetDirection] + (event[screenDirection] - mouseDownPos); 

		if(top < 0){
			top = 0;
		}else if(scrollSize < top){
			top = scrollSize;
		} 
		moveBar.call(scrollBar, top, true);
		target[scrollDirection] = top * (1/ratio) ;
		
		mouseDownPos = event[screenDirection];
	}

	function mouseDown(){
		scrollEvent = false;
		mouseDownPos = event[screenDirection];
		body.style.userSelect = "none";
		window.addEventListener('mousemove', mouseMove);
		window.addEventListener('mouseup', mouseUp);
	}

	function mouseUp(){
		removeEvents();
		scrollEvent = true;
	}

	function removeEvents(){
		window.removeEventListener('mousemove', mouseMove);
		body.style.userSelect = "";
		window.removeEventListener('mouseup', mouseUp);
	}

	function barDragInit(bar){
		bar = bar || scrollBar;
		bar.addEventListener('mousedown', mouseDown);
	}

	function init(newWrap, newTarget){
		wrap = newWrap || wrap ;
		target = newTarget || target ;

		if(clientStyle == 'clientWidth') {
			makeWrap();
		}

		scrollWrap = makeScrollBar();
		scrollBar = scrollWrap.children[0];
		wrap.appendChild(scrollWrap);

		resize();

		target.addEventListener("scroll", function(){
			if(scrollEvent == false) return;
			moveBar.call(scrollBar, this.scrollTop * ratio);
		});
		barDragInit();
	}

	function resize(newWrap, newTarget){
		wrap = newWrap || wrap ;
		target = newTarget || target ;

		if(clientStyle == 'clientWidth') {
			makeWrap();
		}

		console.log(target[scrollStyle], wrap[clientStyle]);
		if(target[scrollStyle] == wrap[clientStyle]){
			scrollWrap.style.display = 'none';	
			target.classList.remove('scroll-on');
		}else {
			scrollWrap.style.display = 'block';	
			target.classList.add('scroll-on');
		}

		scrollBar.style[style] = scrollBarSize() + "px";
		ratio = (wrap[clientStyle] - scrollBarSize()) / (target[scrollStyle] - wrap[clientStyle]);
		scrollSize = getScrollSize();
		target.scrollTop = 0;
		moveBar.call(scrollBar, 0);
	}

	// init();

	return {
		init : init
		,resize : resize
		,wrap : function() {return wrap}
		,target : function() {return target}
		,moveBar : moveBar
		,move : mouseMove
		,makeWrap : makeWrap
	};
}

export default CustomScroll;