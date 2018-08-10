import { Dialog } from '../include/common' ;

const dialog = new Dialog ;

class Share{
	constructor() {
		/**
		@postUrl : 현재 포스트 URL
		@postTitle : 현재 포스트 제목
		*/
		this.info = {
			postUrl : document.URL ,
			postTitle : document.title
		}
	}

	/* FaceBook */
	faceBookShare(){
		let url = "http://www.facebook.com/sharer.php?u=" + encodeURIComponent(this.info.postUrl) + "&t=" + encodeURIComponent( this.info.postTitle );
		this.windowOpen(url, 600, 450);
	}

	/* Twitter */
	twitterShare(){
		let url = "http://twitter.com/intent/tweet?text=" + encodeURIComponent( this.info.postTitle ) + "&url=" + encodeURIComponent(this.info.postUrl);
		this.windowOpen (url, 600, 400);
	}

	/* Naver Blog */
	naverBlogShare(){
		let url = "https://share.naver.com/web/shareView.nhn?url=" + encodeURIComponent(this.info.postUrl) + "&title=" + encodeURIComponent( this.info.postTitle );
		this.windowOpen (url, 500, 600);
	}

	/* google plus */
	googlePlusShare(){
		let url = "https://plus.google.com/share?url=" + encodeURIComponent(this.info.postUrl) + "&t=" + encodeURIComponent(this.info.postTitle);
		this.windowOpen (url, 500, 600);
	}

	/* URL Copy */
	urlCopy(){
		let elem = document.createElement('input') ;
		document.body.appendChild( elem ) ;
		elem.value = this.info.postUrl ;
		elem.select() ;
		document.execCommand('copy') ;
		document.body.removeChild(elem);
		dialog.show( 'URL이 복사되었습니다.' ) ;
	}

	windowOpen( ...args ) {
		let [ url, w, h ] = args ;
		let strPopupInfo = "left=10,top=10,width="+w+",height="+h+",menubar=yes,location=yes,resizable=no,scrollbars=no,status=no";
		window.open(url, "sharePopUp", strPopupInfo);
	}

} ;
export default Share ;
