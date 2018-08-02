/* 
	t : Current time
	b : Start value
	c : Change in value
	d : Duration
*/
class Easing {
	constructor () {
	}

	quadIn (t,b,c,d) {
		t /= d;
		return 	c*t*t + b;	
	}

	quadOut (t,b,c,d) {
		t /= d;
		return -c * t*(t-2) + b;
	}

	quarInOut (t,b,c,d) {
		t /= d/2;
		if (t < 1) return c/2*t*t + b;
		t--;
		return -c/2 * (t*(t-2) - 1) + b;
	}

	cubicIn (t,b,c,d) {
		t /= d;
		return c*t*t*t + b;
	}

	cubicOut (t,b,c,d) {
		t /= d;
		t--;
		return c*(t*t*t + 1) + b;
	}

	cubicInOut (t,b,c,d) {
		t /= d/2;
		if (t < 1) return c/2*t*t*t + b;
		t -= 2;
		return c/2*(t*t*t + 2) + b;
	}

	quartIn (t,b,c,d) {
		t /= d;
		return c*t*t*t*t + b;
	}

	quartOut (t,b,c,d) {
		t /= d;
		t--;
		return -c * (t*t*t*t - 1) + b;
	}

	quartInOut (t,b,c,d) {
		t /= d/2;
		if (t < 1) return c/2*t*t*t*t + b;
		t -= 2;
		return -c/2 * (t*t*t*t - 2) + b;
	}

	quintIn (t,b,c,d) {
		t /= d;
		return c*t*t*t*t*t + b;
	}

	quintOut (t,b,c,d) {
		t /= d;
		t--;
		return c*(t*t*t*t*t + 1) + b;
	}

	quintInOut (t,b,c,d) {
		t /= d/2;
		if (t < 1) return c/2*t*t*t*t*t + b;
		t -= 2;
		return c/2*(t*t*t*t*t + 2) + b;
	}

	sineIn (t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	};

	sineOut (t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	};

	sineInOut (t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	};

	expoIn (t, b, c, d) {
		return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
	};

	expoOut (t, b, c, d) {
		return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
	};


	expoInOut (t, b, c, d) {
		t /= d/2;
		if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
		t--;
		return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
	};

	circIn (t, b, c, d) {
		t /= d;
		return -c * (Math.sqrt(1 - t*t) - 1) + b;
	};

	circOut (t, b, c, d) {
		t /= d;
		t--;
		return c * Math.sqrt(1 - t*t) + b;
	};

	circInOut (t, b, c, d) {
		t /= d/2;
		if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		t -= 2;
		return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
	};

}


export default Easing;