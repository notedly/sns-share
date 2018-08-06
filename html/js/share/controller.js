class ShareControl{
	constructor() {

		this.state = {
			url : document.URL ,
			title : document.title
		}

		// console.log('URL :', this.state.url )
		// console.log('Title :', this.state.title )
	}

	faceBook() {
		console.log( '페이스북 공유 실행!' ) ;
		let url = "http://www.facebook.com/sharer.php?u=" + encodeURIComponent(this.state.url) + "&t=" + encodeURIComponent(this.state.title);
		this.windowOpen(url, 900, 450, 'no');

	}
	twitter() {
		console.log( '트위터 공유 실행!' ) ;
		let url = "http://twitter.com/share?text=" + encodeURIComponent(this.state.title) + "&url=" + encodeURIComponent(this.state.url);
		this.windowOpen (url, 800, 400, 'yes');
	}


	windowOpen = ( ...args ) => {
		let [ url, w, h, scroll ] = args;
		console.log( url , w, h, scroll ) ;
		window.open(url, "left=0,top=0,width="+w+",height="+h+",scrollbars="+scroll+",toolbar=no,location=no,directories=no,status=no,menubar=no,resizable=no");

	}


} ;
export default ShareControl ;
