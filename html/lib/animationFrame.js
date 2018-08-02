window.requestAnimationFrame = function() {
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	function(f) {
		window.setTimeout(f,1e3/60);
	}
}();

class AnimationFrame {
	constructor (status=false) {
		this.loop = status;
	}

	Frame ( fps , callback ) {
		var fps = fps
		,	now
		,	then = Date.now()
		,	interval = 1000 / fps
		,	self = this
		,	delta
		;

		this.loop = true ; 
		this.counter = 0 ;

		var first = then ; 

		function draw () {
			if ( !self.loop ) return ; 
			window.requestAnimationFrame( draw ) ; 

			now = Date.now() ; 
			delta = now - then ; 
			if ( delta > interval ) {
				var time_el
				,	obj = {} ; 
				then = now - ( delta % interval ) ; 
				time_el = ( then - first ) / 1000 ; 
				/*
				counter : f. frame 이 도는 속도 
				timer : 현재 프레임이 실행된 시간 
				fps : 현재 프레임이 지속되는 속도
				*/
				obj = {
					counter : self.counter + 'f' , 
					time_el :  Math.ceil(time_el) + 's' , 
					fps : Math.ceil( self.counter / time_el ) + ' fps' , 
					interval : parseInt( interval ) , 
					lag : parseInt( delta % interval ) 
				} ; 

				callback( obj ) ; 
				++ self.counter ;  
			}
		}

		this.draw = draw;

		draw() ; 
	}

	get stop () {
		this.loop = false;
		this.counter = 0;
	}

	get start () {
		this.loop = true;
		this.draw();
	}
}

export class AnimationFrameControler extends AnimationFrame {
	constructor (list={}, add=true) {
		super();
		this.list = list;
		this.add = true;
		this.actives = [];
		
		if(add){
			for(let value of Object.keys(list)){
				this.actives.push(list[value])
			}
		}	
	}

	Enable(name, f){
		if(f) {
			this.list[name] = f;
			// this.list[name] = name;
		}
		this.actives.push(name);
	}

	Disable(name, remove=false){
		if(name){
			for(let value of this.actives){
				if(value == name ){
					this.actives.splice(i,1);
					if(remove === true) delete this.list[name];
					break;
				}
			}
		}else{
			this.actives = [];
			if(remove === true) this.list = {}
		}
	}

	Run (fps) {
		let This = this;
		this.Frame(fps, function(time){
			This.actives.forEach(function(key){
				if(typeof This.list[key] == 'function'){
					This.list[key](time, key)
				}
			});
		});
	}

	get Stop () {
		this.Frame.stop;
	}

	get play () {
		this.Frame.start;
	}

}


/*var animationCtrl = new AnimationLoopControler({
	test1 : function(time){console.log(this, arguments)},
	test2 : { a:1, a:2 },
}) ; */