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

		/* svg 아이콘을 전달 받았을 경우에만 노출됩니다. */
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
