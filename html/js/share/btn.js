import React , { Component } from 'react' ;
import ReactDOM , { render } from 'react-dom' ;
import Common from '../ui/common' ;
import ShareControl from './controller' ;

class Btn extends Component {
	constructor( props ){
		super( props ) ;
		this.state = {
			btns : this.props.options
		}

		// 버튼 컨트롤 기능
		this.ShareControl = new ShareControl ;

		console.log( '버튼 옵션 : ', this.state.btns ) ;
	}

	clickHandler = (e) => {

		switch( this.state.btns.type ){
			case 'facebook' : this.ShareControl.faceBook() ;
			break ;
			case 'twitter' : this.ShareControl.twitter() ;
			break ;
		}

	}

	render(){

		let opts = this.state.btns ;

		return(
			<button type="button" className={opts.class} onClick={this.clickHandler.bind(this)}>{opts.label}</button>
		)
	}
}

export { Btn } ;
