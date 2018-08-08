import React , { Component } from 'react' ;
import ReactDOM , { render } from 'react-dom' ;
import Common from './ui/common' ;
import {Controller} from './share/controller' ;
import {Btn} from './share/btn' ;
import { Dialog } from './include/common' ;

const dialog = new Dialog ;

class IndexContainer extends Component {
	constructor( props ){
		super( props ) ;

		this.state = {
			pageURL : document.URL ,
			pageTitle : document.title
		}

		// 공유 버튼 목록
		this.btns = [
			{
				type : 'facebook' ,
				label : '페이스북에 공유하기' ,
				class : 'btn fb' ,
				icon : `<svg class="icon icon-facebook"><use xlink:href="http://localhost:7000/images/icons.svg#icon-facebook"></use></svg>` ,
				clickHandler : this.faceBookShare
			} ,
			{
				type : 'twitter' ,
				label : '트위터에 공유하기' ,
				class : 'btn tw' ,
				icon : `<svg class="icon icon-twitter"><use xlink:href="http://localhost:7000/images/icons.svg#icon-twitter"></use></svg>` ,
				clickHandler : this.twitterShare
			} ,
			{
				type : 'googlePlus' ,
				label : '구글플러스에 공유하기' ,
				class : 'btn gp' ,
				icon : `<svg class="icon icon-google-plus"><use xlink:href="http://localhost:7000/images/icons.svg#icon-google-plus"></use></svg>` ,
				clickHandler : this.googlePlusShare
			} ,
			// {
			// 	type : 'naverBlog' ,
			// 	label : '네이버 블로그에 공유하기' ,
			// 	class : 'btn nb' ,
			// 	icon : `<svg class="icon icon-google-plus"><use xlink:href="http://localhost:7000/images/icons.svg#icon-google-plus"></use></svg>` ,
			// 	clickHandler : this.naverBlogShare
			// } ,

			{
				type : 'urlCopy' ,
				label : 'URL' ,
				class : 'btn uc' ,
				clickHandler : this.urlCopy
			}
		] ;
	}

	componentDidMount(){

		/* 포스팅 제목이 있다면
		포스팅 제목을 공유 타이틀 값으로 설정합니다.
		*/
		let titleElem = document.querySelector('.topWrap h2') ;
		if( titleElem ) {
			this.setState({
				pageTitle : titleElem.firstChild.textContent
			}) ;
		}

		setTimeout(() => {
			console.log( 'pageURL :', this.state.pageURL ) ;
			console.log( 'pageTitle :', this.state.pageTitle ) ;
		},1000) ;
	}

	/* FaceBook */
	faceBookShare = () => {
		let url = "http://www.facebook.com/sharer.php?u=" + encodeURIComponent(this.state.pageURL) + "&t=" + encodeURIComponent( this.state.pageTitle );
		this.windowOpen(url, 600, 450);
	}

	/* Twitter */
	twitterShare = () => {
		let url = "http://twitter.com/intent/tweet?text=" + encodeURIComponent( this.state.pageTitle ) + "&url=" + encodeURIComponent(this.state.pageURL);
		this.windowOpen (url, 600, 400);
	}

	/* Naver Blog */
	naverBlogShare = () => {
		let url = "https://share.naver.com/web/shareView.nhn?url=" + encodeURIComponent(this.state.pageURL) + "&title=" + encodeURIComponent( this.state.pageTitle );
		this.windowOpen (url, 500, 600);
	}

	/* google plus */
	googlePlusShare = () => {
		let url = "https://plus.google.com/share?url=" + encodeURIComponent(this.state.pageURL) + "&t=" + encodeURIComponent(this.state.pageTitle);
		this.windowOpen (url, 500, 600);
	}

	/* URL Copy */
	urlCopy = () => {
		let elem = document.createElement('input') ;
		document.body.appendChild( elem ) ;
		elem.value = this.state.pageURL ;
		elem.select() ;
		document.execCommand('copy') ;
		document.body.removeChild(elem);
		dialog.show( 'URL이 복사되었습니다.' ) ;
	}

	windowOpen = ( ...args ) => {
		let [ url, w, h ] = args
		,	 left = (window.outerWidth/2)-(w/2)
		, 	 top = (window.outerHeight/2)-(h/2) ;

		let strWindowFeatures = "left="+left+",top="+top+",width="+w+",height="+h+",menubar=yes,location=yes,resizable=no,scrollbars=no,status=no";
		window.open(url, "sharePopUp", strWindowFeatures);
	}


	render(){
		let makeSnsBtn = ( btn , idx ) => {
			let snsProps = {
				key : `btn${idx}` ,
				options : {
					type : btn.type ,
					label : btn.label ,
					class : btn.class ,
					icon : btn.icon ,
					clickHandler : btn.clickHandler
				}
			}
			return <Btn {...snsProps} />
		}
		return(
			<div className="snsWrap">
				{/*<button type="button" className="btn_open">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
				</button>*/}
				<div className="btn_area">
					{ this.btns.map( makeSnsBtn ) }
				</div>
			</div>
		)
	}
}

window.addEventListener( 'load' , () => {
	let indexContainer = document.createElement( 'div' ) ;
	indexContainer.classList.add( 'wrap') ;
	render( <IndexContainer /> , indexContainer ) ;
	document.body.appendChild( indexContainer ) ;
}) ;



