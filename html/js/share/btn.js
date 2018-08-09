import React , { Component } from 'react' ;
import ReactDOM , { render } from 'react-dom' ;
import Common from '../ui/common' ;

class Btn extends Component {
	constructor( props ){
		super( props ) ;
		this.state = {
			btn : this.props.options
		}
	}
	render(){

		let btn = this.state.btn
		,	 sns_icon = null ;

		if ( btn.icon != undefined || btn.icon != null ) {
			sns_icon = <i className="icon" dangerouslySetInnerHTML={{ __html : btn.icon }} /> ;
		}

		return(
			<button type="button" className={btn.class} onClick={btn.clickHandler}>
				{sns_icon}
				{btn.label}
			</button>
		)
	}
}

export { Btn } ;
