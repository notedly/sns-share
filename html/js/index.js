import React , { Component } from 'react' ;
import ReactDOM , { render } from 'react-dom' ;
import Common from './ui/common' ;
import {Controller} from './share/controller' ;
import {Btn} from './share/btn' ;

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
				clickHandler : this.faceBookShare
			} ,
			{
				type : 'twitter' ,
				label : '트위터에 공유하기' ,
				class : 'btn tw' ,
				clickHandler : this.twitterShare
			} ,
			{
				type : 'naverBlog' ,
				label : '네이버 블로그에 공유하기' ,
				class : 'btn nb' ,
				clickHandler : this.naverBlogShare
			} ,
			{
				type : 'googlePlus' ,
				label : '구글플러스에 공유하기' ,
				class : 'btn gp' ,
				clickHandler : this.googlePlusShare
			} ,
			{
				type : 'urlCopy' ,
				label : 'URL복사하기' ,
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
		let url = "http://twitter.com/share?text=" + encodeURIComponent( this.state.pageTitle ) + "&url=" + encodeURIComponent(this.state.pageURL);
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
		alert( 'URL이 복사되었습니다.' ) ;
	}

	windowOpen = ( ...args ) => {
		let [ url, w, h ] = args;
		console.log( 'url : ', url ) ;
		console.log( 'width : ', w ) ;
		console.log( 'height : ', h ) ;

		let strWindowFeatures = "left=100,top=100,width="+w+",height="+h+",menubar=yes,location=yes,resizable=no,scrollbars=no,status=no";

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
					clickHandler : btn.clickHandler
				}
			}
			return <Btn {...snsProps} />
		}
		return(
			<div className="snsWrap">
				{ this.btns.map( makeSnsBtn ) }
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



