import React , { Component } from 'react' ;
import ReactDOM , { render } from 'react-dom' ;
import Common from './ui/common' ;
import Share from './share/Share' ;
import { Btn } from './share/btn' ;

class ShareContainer extends Component {
	constructor( props ){
		super( props ) ;

		/**[ state ]
		@postUrl : 현재 포스트 URL
		@postTitle : 현재 포스트 제목
		*/
		this.state = {
			postUrl : document.URL ,
			postTitle : document.title
		}

		/**[ this ]
		@share : 공유 인스턴스( 공유 관련 스크립트 모음 )
		@btns : 공유 버튼들 모음
		*/
		this.share = new Share ;

		/**
		@type : 공유 버튼 타입
		@label : 버튼 태그 텍스트 콘텐츠
		@class : 버튼 클래스
		@icon : 버튼 svg 아이콘
		@clickHandler : 버튼 클릭 이벤트
		*/
		this.btns = [
			{
				type : 'facebook' ,
				label : '페이스북에 공유하기' ,
				class : 'btn fb' ,
				icon : `<svg class="icon icon-facebook"><use xlink:href="http://localhost:7000/images/icons.svg#icon-facebook"></use></svg>` ,
				clickHandler : () => this.share.faceBookShare() ,
			} ,
			{
				type : 'twitter' ,
				label : '트위터에 공유하기' ,
				class : 'btn tw' ,
				icon : `<svg class="icon icon-twitter"><use xlink:href="http://localhost:7000/images/icons.svg#icon-twitter"></use></svg>` ,
				clickHandler : () => this.share.twitterShare() ,
			} ,
			{
				type : 'googlePlus' ,
				label : '구글플러스에 공유하기' ,
				class : 'btn gp' ,
				icon : `<svg class="icon icon-google-plus"><use xlink:href="http://localhost:7000/images/icons.svg#icon-google-plus"></use></svg>` ,
				clickHandler : () => this.share.googlePlusShare() ,
			} ,
			{
				type : 'naverBlog' ,
				label : '네이버 블로그에 공유하기' ,
				class : 'btn nb' ,
				clickHandler : () => this.share.naverBlogShare() ,
			} ,
			{
				type : 'urlCopy' ,
				label : 'URL 복사' ,
				class : 'btn uc' ,
				clickHandler : () => this.share.urlCopy() ,
			}
		] ;
	}

	componentDidMount(){
		/* 현재 meta tag (title , url) 에 대한 작업이 되어 있지 않아 임시로 적용하는 스크립트입니다. */
		let titleElem = document.querySelector('.topWrap h2')
		,	 ogUrl = document.querySelector('meta[property="og:url"]')
		,	 ogTitle = document.querySelector('meta[property="og:title"]')
		,	 twTitle = document.querySelector('meta[name="twitter:title"]') ;

		/* 포스팅 제목이 있는 페이지라면 포스팅 제목을 공유 타이틀 값으로 설정합니다.	*/
		if( titleElem ) {
			this.setState({
				postTitle : titleElem.firstChild.textContent
			}) ;
			ogTitle.content = titleElem.firstChild.textContent ;
			twTitle.content = titleElem.firstChild.textContent ;
		}
		ogUrl.content = this.state.postUrl ;

	}

	render(){

		/* 버튼 생성 함수 */
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
			<div className="share">
				<div className="btn_area">
					{ this.btns.map( makeSnsBtn ) }
				</div>
			</div>
		)
	}
}

window.addEventListener( 'load' , () => {
	let shareContainer = document.createElement( 'div' ) ;
	shareContainer.classList.add( 'wrap') ;
	render( <ShareContainer /> , shareContainer ) ;
	document.body.appendChild( shareContainer ) ;
}) ;



