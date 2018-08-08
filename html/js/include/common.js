import React , { Component } from 'react' ; 
import { AjaxLoadPost } from '../../lib/common' ; 

const itemKey = Symbol();

class MenuDown extends Component {
	constructor (props) {
		super(props);
		this.state = {
			name : this.props.name || 'list',
			container : document.createElement('div'),
			open : false,
			onChange : this.props.onChange,
			position : this.props.position || 'left',
			value : '',
			button : this.props.onButton
		}

		this.state.container.dataset['menuname'] = this.state.name;
		this.state.container.classList.add(this.props.menuClassName || 'menuItems');

		this.Items = this.props.children.props.children;

		// this.component = <div>
		// 		<this.Items.type>
		// 			{
		// 			this.Items.props.children.map( (item, index)=>{
		// 				console.log(item);
		// 				return <item.type key={index} tabIndex={index} className={item.props.value == this.state.value ? 'selected' : ''} onClick={ (e)=>{ this.onClick(e, item.props.value, index) } } >{item.props.children}</item.type>
		// 			})
		// 			}
		// 		</this.Items.type>
		// 	</div> 

		// console.log(this.state.button)
	}

	onClick = (e, value, index) => {
		this.setState({
			value: value,
		});

		if(typeof this.state.onChange == 'function') this.state.onChange(value, index);
		this.menuClose();
	}

	setListPosition = () => {
		let buttonRect = this.refs.button.getBoundingClientRect();
		let containerStyle = window.getComputedStyle(this.state.container);
		let style = {
			position: 'absolute',
			top: `${buttonRect.bottom}px`,
			left: `${buttonRect[this.state.position]}px`,
		}

		for(let value in style){
			this.state.container.style[value] = style[value];
		}

	}

	componentWillReceiveProps = (nextProps) => {
		this.setState({value: nextProps.value});
	}

	menuOpen = () => {
		let component = <div>
				<this.Items.type>
					{
					this.Items.props.children.map( (item, index)=>{
						return <item.type key={index} tabIndex={index} className={item.props.value == this.state.value ? 'selected' : ''} onClick={ (e)=>{ this.onClick(e, item.props.value, index) } } >{item.props.children}</item.type>
					})
					}
				</this.Items.type>
			</div> 

		ReactDOM.render(component, document.body.appendChild(this.state.container));
		this.setListPosition();
		this.state.open = true;	
	}
	menuClose = () => {
		ReactDOM.unmountComponentAtNode(this.state.container);
		document.body.removeChild(this.state.container);
		this.state.open = false;
	}

	menuToggle = () => {
		if(this.state.open === true){
			this.menuClose();
		}else{
			this.menuOpen();
		}
	}

	onClickButton = (e) => {
		e.preventDefault();
		this.menuToggle();
	}
	
	render () {
		return (
			<this.state.button.type  {...this.state.button.props} ref={this.state.button.ref || 'button'} onClick={this.state.button.props.onClick || this.onClickButton} >
				{this.state.button.children || this.state.value}
			</this.state.button.type>
		)
	}
}

class SummaryItem extends Component {
	/*공통요소 : 요약아이템들을 뿌려줍니다. 
	메인 페이지나 서브페이지 어디에서나 포스팅 목록을 보여줄 수 있습니다. */
	[itemKey] = {};

	constructor ( props ) {
		super( props ) ; 
		/**
		[state]
		@items : { // 노출될 포스트 데이터 모음 
			@description : 포스트 설명 
			@title : 제목 
			@url : 포스팅 경로 
		}
		@headType : item의 title이 tag의 커스텀이 필요할 경우 children의 tag type을 가져옴 default tag는 <p></p>
			<SummeryItem >
				<h2 /> //해당 태그를 가져옴  
			</SumaryItem>

		// 테스트 중 적용 여부는 잠시 보류
		@keyMap : 데이터 내 key와 SummaryItem 함수 내 데이터 키가 다를 경우 소스를 고치기 보다는 map을 수정
		default object = {
			category : 'category' = 카테고리 
			title : 'title' = 글 제목
			description : 'description' = 글 상세
			admin_id : 'user' = 글 작성자
			regist_date : 'date' = 작성 날짜
		}
		*/
		this[itemKey] = {
			category : 'category',
			title : 'title',
			description : 'description',
			admin_id : 'admin_id',
			regist_date : 'regist_date',
		}

		let setKey = () => {
			if(this.props.keyMap){
				for(let key in this.props.keyMap) {
					this[itemKey] = this.props.keyMap[key];
				}
			}

			return this[itemKey];
		};

		this.state = {
			items : this.props.items , 
			headType : this.props.children.type,
			keyMap : setKey(),
		} ; 

		// console.log("Summary Items: ", this.state, this.props);
	}

	makeGroup = (items) => {
		let categoryGroup = {}
		,	categorys = []
		;
		items = items.map( item => {
			if(!categoryGroup.hasOwnProperty(item.category)) {
				categoryGroup[ item.category ] = []
				categorys.push(item.category);
			}
			categoryGroup[item.category].push( item );
		}) ; 

		return {
			categoryGroup,
			categorys
		}
	}

	itemComponent = ( items ) => {
		let Head = 'div';
		// 만약 상위 타이틀의 테그가 h 경우 상위 넘버링이 맞춰 head 설정
		if(this.state.headType.match(/h[1-9]/)) {
			Head = 'h' + ( parseInt( this.state.headType.match(/h[1-4]/)[0].split('h')[1] ) + 1 );
		}

		return items.map(( item , idx ) => {
			// console.log( 'item : ' , item ) ; 
			let	user = <span className="nick">{ item.admin_id }</span>
			,	date = <span className="date">{ item.regist_date }</span>
			;

			return <div key={ `item-${idx}` } className="item">
				<a href={ `/post/${item.no}` }>
					{user}{date}
					<Head className="title">{ item.title }</Head>
					<p className="desc">{ item.description }</p>
				</a>
			</div>
		}) ; 
	}

	itemWrap = (items) => {
		items = this.makeGroup(items);
		return items.categorys.map( (category)=> {
			let title
			;

			if(this.props.children) {
				title = <this.state.headType className='title'>{category}</this.state.headType>
			}else {
				title = <p className='title'>{category}</p>
			}

			return <div key={`category-${category}`} className='itemsWrap'>
				{ title }
				{ this.itemComponent( items.categoryGroup[category] ) || this.props.children }
			</div>
		} );
	}

	render () {
		return this.itemWrap(this.state.items);
	}
}

class Dialog {
	/**
	브라우저 사용시에 사용자에게 알리고싶은 대화가 있을경우 사용됩니다. 

	@optionsSet - function({ key : value ...N }) : 화면에 띄워질 다이얼로그 팝업에 전달받은 
	옵션들을 설정합니다. 

	@makeBtn - function : 다이얼로그에서 설정된 버튼 타입에 따라 다이얼로그 팝업에 버튼형태의 
	마크업을 추가해줍니다.

	@initSet - function : 다이얼로그 팝업에서 사용되는 모든 값을을 초기화 합니다.

	@close - function : 다이얼로그 팝업을 브라우저에서 삭제합니다.

	@evtSet - function : 다이얼로그 팝업에 필요한 이벤트들을 각각의 DOMNode 에 위임시켜줍니다.

	@makeDOM - function : 다이얼로그 팝업의 뼈대가 되는 DOMTree 를 제작합니다.

	@show - function({ key :value ...N }) : 다이얼로그 팝업을 오픈 합니다. 전달받은 옵션값들이 있다면 
	각각 필요한 내장함수에 전달하여 줍니다. 


	예제1 ) 기본 호출 
	dialog.show( '안녕, 세상아!' ) ; 

	예제2 ) 옵션 추가 호출 
	dialog.initSet({
		str : '안녕 세상아!' , 
		btns : [
			{ opt : 'confirm' , value : '확인' } , 
			{ opt : 'cancel' , value : '취소' } , 
		] , 
		callback : function ( result ) {
			console.log( result ) ; 
		} , 
	}) ; 
	dialog.show() ; 
	*/
	constructor () {
		this.initSet() ; 
		
	}

	optionsSet = ( options ) => {
		// console.log( 'options : ' , options ) ; 
		for ( let key in options ) {
			if ( !this.options.hasOwnProperty( key ) ) {
				this.options[key] = options[key] ; 
			}
		}
	}

	makeBtn = () => {
		switch( this.btnType ) {
			case 0 : 
				this.btns += `<button>확인</button>` ; 
				break ; 
			case 1 : 
				// console.log( 'chk : ' , this.options.btns ) ; 
				[].forEach.call( this.options.btns , btn => {
					// console.log( btn , 'btn.focus : ' , btn.focus ) ; 
					this.btns += `<button data-opt='${ btn.opt }' ${ btn.focus ? 'data-focus=\'true\'' : '' }>${ btn.value }</button>` ; 
				}) ; 
				break ; 
		}
	}

	initSet = ( options ) => {
		if ( this.elemPop != null ) {
			this.openBln = false ; 
			return ; 
		}
		this.btns = '' ; 
		this.elemPop = null ; 
		this.options = {} ; 
		this.crntBtn = null ; 
		this.btnType = ( options && options.btns != undefined ) ? 1 : 0 ; 

		this.optionsSet( options ) ; 
	}

	close = () => {		
		if ( this.options.callback ) {
			this.options.callback( this.crntBtn.dataset.opt ) ; 
		}

		this.elemPop.parentNode.removeChild( this.elemPop ) ; 
		this.elemPop = null ; 
		this.initSet() ; 
		delete this.openBln ; 
	}

	evtSet = () => {
		let 	dimmed = this.elemPop 
		,	btns = this.elemPop.querySelectorAll( 'div.btns button' ) ; 

		dimmed.addEventListener( 'click' , ( e ) => {
			// console.log( 'clicked' ) ; 
			if ( this.elemPop == e.target ) {
				this.crntBtn = e.target ; 
				this.close() ; 
			}
		}) ; 

		[].forEach.call( btns , btn => {
			if ( btn.dataset.focus ) {
				/* 버튼 옵션중 포커스가 존재한다면 제작된 버튼으로 포커스를이동시켜 줍니다. 
				이동된 포커스로 인해 마우스를 사용하지않고 키보드로 다이얼로그 팝업의 버튼을 사용할 수 있습니다. */
				btn.focus() ; 
			}

			btn.addEventListener( 'click' , ( e ) => {
				e.stopPropagation() ; 
				this.crntBtn = e.target ; 
				this.close() ; 
			}) ; 
		}) ; 
	}

	makeDOM = () => {
		let elemTemplate = `
			<div class="contentWrap">
				<p class="desc">${this.options.str}</p>
				<div class="btns">${this.btns}</div>
			</div>
		` 
		, elemTemp = document.createElement( 'div' ) ; 

		elemTemp.classList.add( 'dialogPop' ) ; 
		elemTemp.innerHTML = elemTemplate ; 

		this.elemPop = elemTemp ; 
		document.body.appendChild( elemTemp ) ; 
		setTimeout(() => {
			elemTemp.classList.add( 'show' ) ; 
		} , 100 ) ; 
	}

	show ( ...options ) {
		if ( this.openBln == false ) {
			return ; 
		}

		if ( options.length == 0 ) {
			this.makeBtn() ; 
			this.makeDOM() ; 
			this.evtSet() ; 
		}
		
		if ( options.length == 1 && typeof options[0] == 'string' ) {
			this.optionsSet({ str : options[0] }) ; 
			this.makeBtn() ; 
			this.makeDOM() ; 
			this.evtSet() ; 
		}

		if ( 
			options.length == 2 && 
			typeof options[0] == 'string' && 
			typeof options[1] == 'function' 
		) {
			this.optionsSet({ 
				str : options[0] , 
				callback : options[1] , 
			}) ; 
		
			this.makeBtn() ; 
			this.makeDOM() ; 
			this.evtSet() ; 
		}
	}
}

class Snackbar {
	constructor () {
		this.options = {} ; 
		this.elemPop = null ; 
		this.openBln = false ; 
		this.delayTime = 3000 ; 
	}

	makeDOM = () => {
		let options = this.options 
		,	elemTemplate = `
			<div class="contentWrap">
				<p class="desc">${ options.str }</p>
				<button class="delete">delete</button>
			</div>
		` 
		, elemTemp = document.createElement( 'div' ) ; 

		elemTemp.classList.add( 'snackbarWrap' ) ; 
		elemTemp.innerHTML = elemTemplate ; 

		this.elemPop = elemTemp ; 
		document.body.appendChild( elemTemp ) ; 

		setTimeout(() => {
			elemTemp.classList.add( 'show' ) ; 
		} , 100 ) ; 

		setTimeout(() => {
			this.hide() ; 
		} , this.delayTime ) ; 
	}

	evtSet = () => {
		let btnDel = this.elemPop.querySelector( 'button.delete' ) ; 
		btnDel.addEventListener( 'click' , this.delete ) ; 
	}

	delete = () => {
		this.hide() ; 
		this.openBln = false ; 
	}

	show = ( str ) => {
		if ( this.openBln ) {
			this.elemPop.parentNode.removeChild( this.elemPop ) ; 
			this.elemPop = null ; 
			this.openBln = false ; 
		}

		this.options.str = str ; 
		this.openBln = true ; 
		this.makeDOM() ; 
		this.evtSet() ; 
	}

	hideHandler = ( e ) => {
		this.elemPop.removeEventListener( e.type , this.hideHandler ) ; 
		this.elemPop.parentNode.removeChild( this.elemPop ) ; 
		this.openBln = false ; 
	}

	hide = () => {
		if ( !this.openBln ) return; 
		console.log( 'hide' ) ; 
		this.elemPop.classList.remove( 'show' ) ; 
		this.elemPop.addEventListener( 'transitionend' , this.hideHandler ) ; 
	}
}

/*
	페이징 템플릿
	props : 
	 1. page (number) : 현재 페이지 위치 
	    - default : 0
	 2. pageLength ( number ) : 한 화면에 보여질 페이지 수
		- default : 5
	 3. totalLength ( number ) : 아이템의 총 개수 ( 데이트의 총 개수 )
		- default : 0
	 4. link ( string ) : 페이징을 위한 링크
		- default : 현재 페이지의 주소
	 5. query ( string ) : 페이징의 정보를 구분 할 수 있는 쿼리
		- default : 'page' 
		- ex : localhost:8000/board?page=0  ( 설정 된 쿼리 뒤에 숫자를 넣어 현재가 자신이 페이지가 어디인지 구분 )
	 6. onClick ( funcfion ) : 페이징을 클릭 했을 경우 동작 설정
	 	- 기본 적으로 등록 된 함수 사용 아래 onclick 참고
*/

class Pagination extends Component {
	constructor (props) {
		super( props );
		this.state = {
			page : Number(this.props.page) || 0, // 현재 페이지 위치
			pageLength : Number(this.props.pageLength) || 5,
			totalLength : Number(this.props.totalLength) || 0,
			link : this.props.link || location.pathname,
			query : this.props.query || 'page',
			onClick : this.props.onClick
		}

		console.log('Pagination state : ', this.state)
	}

	OnClick = (name) => (e) => {
		e.preventDefault();

		let url = e.target.getAttribute('href');
		let regQuery = new RegExp(`${name}=[0-9]*`);
		url = url.match(regQuery)[0];
		// 현재 path 혹은 설정 된 path 에서 query 중 설정 된 이름에 해당하는 쿼리만 수정 후 url 재 설정
		if(location.search.match(regQuery, url) == null){
			url = location.pathname + `?${url}`;
		}else{
			url = location.pathname + location.search.replace(regQuery, url );
		}
		location.href = url;
	}

	makeItem () {
		let pageList = [];
		let start = Math.floor( this.state.page/this.state.pageLength ) * this.state.pageLength;
		let length = Math.min(this.state.totalLength - start, this.state.pageLength);

		console.log("Pagination makeitem : ", this.state);

		if(start !== 0) {
			pageList.push( <a key={`first`} onClick={this.props.onClick || this.OnClick(this.state.query)} href={`${this.state.link}?${this.state.query}=0`}>first</a> );
			pageList.push( <a key={`prev`} onClick={this.props.onClick || this.OnClick(this.state.query)} href={`${this.state.link}?${this.state.query}=${start -1}`}>prev</a> );
		}
		for(let i=0; i<length; i++){
			if(this.state.page == (i + start)) {
				pageList.push( <a key={`link-${i}`} onClick={this.props.onClick || this.OnClick(this.state.query)} className='selected' href={`${this.state.link}?${this.state.query}=${i + start}`}>{ i + start + 1 }</a> );
			}else{
				pageList.push( <a key={`link-${i}`} onClick={this.props.onClick || this.OnClick(this.state.query)} href={`${this.state.link}?${this.state.query}=${i + start}`}>{ i + start + 1 }</a> );
			}
		}
		if(this.state.totalLength - start > this.state.pageLength) {
			pageList.push( <a key={`next`} onClick={this.props.onClick || this.OnClick(this.state.query)} href={`${this.state.link}?${this.state.query}=${start + this.state.pageLength}`}>next</a> );
			pageList.push( <a key={`last`} onClick={this.props.onClick || this.OnClick(this.state.query)} href={`${this.state.link}?${this.state.query}=${this.state.totalLength-1}`}>last</a> );
		}

		return pageList;
	}

	componentWillReceiveProps (nextProps) {
		this.setState(nextProps);
	}

	render () {
		return <div className="pagination">{this.makeItem()}</div>
	}
}

export {
	SummaryItem , 
	MenuDown , 
	Dialog , 
	Snackbar , 
	Pagination ,
} ; 