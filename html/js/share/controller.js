class ShareControl{
	constructor() {

		this.pageInfo = {
			url : document.URL ,
			title : document.title
		}

		console.log('URL :', this.pageInfo.url )
		console.log('Title :', this.pageInfo.title )
	}

	faceBook() {
		console.log( '페이스북 공유 스크립트 실행!' ) ;
	}
	twitter() {
		console.log( '트위터 공유 스크립트 실행!' ) ;
		window.open(
			'https://twitter.com/intent/tweet?text=[%EA%B3%B5%EC%9C%A0]%20'
			+ encodeURIComponent(this.pageInfo.url)
			+'%20-%20'
			+encodeURIComponent(this.pageInfo.title),
			'twittersharedialog',
			'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
		);
	}


} ;
export default ShareControl ;
