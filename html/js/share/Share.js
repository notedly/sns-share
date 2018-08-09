import { Dialog } from '../include/common' ;

const dialog = new Dialog ;

class Share{
	constructor() {
		/**[ state ]
		@postUrl : 현재 포스트 URL
		@postTitle : 현재 포스트 제목
		*/
		this.state = {
			postUrl : document.URL ,
			postTitle : document.title
		}
	}

	/* FaceBook */
	faceBookShare(){
		let url = "http://www.facebook.com/sharer.php?u=" + encodeURIComponent(this.state.postUrl) + "&t=" + encodeURIComponent( this.state.postTitle );
		this.windowOpen(url, 600, 450);
	}

	/* Twitter */
	twitterShare(){
		let url = "http://twitter.com/intent/tweet?text=" + encodeURIComponent( this.state.postTitle ) + "&url=" + encodeURIComponent(this.state.postUrl);
		this.windowOpen (url, 600, 400);
	}

	/* Naver Blog */
	naverBlogShare(){
		let url = "https://share.naver.com/web/shareView.nhn?url=" + encodeURIComponent(this.state.postUrl) + "&title=" + encodeURIComponent( this.state.postTitle );
		this.windowOpen (url, 500, 600);
	}

	/* google plus */
	googlePlusShare(){
		let url = "https://plus.google.com/share?url=" + encodeURIComponent(this.state.postUrl) + "&t=" + encodeURIComponent(this.state.postTitle);
		this.windowOpen (url, 500, 600);
	}

	/* URL Copy */
	urlCopy(){
		let elem = document.createElement('input') ;
		document.body.appendChild( elem ) ;
		elem.value = this.state.postUrl ;
		elem.select() ;
		document.execCommand('copy') ;
		document.body.removeChild(elem);
		dialog.show( 'URL이 복사되었습니다.' ) ;
	}

	windowOpen( ...args ) {
		let [ url, w, h ] = args
		,	 left = (window.outerWidth/2)-(w/2)
		, 	 top = (window.outerHeight/2)-(h/2) ;
		let strWindowFeatures = "left="+left+",top="+top+",width="+w+",height="+h+",menubar=yes,location=yes,resizable=no,scrollbars=no,status=no";
		window.open(url, "sharePopUp", strWindowFeatures);
	}

} ;
export default Share ;
