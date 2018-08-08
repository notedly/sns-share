import React , { Component } from 'react' ;
import ReactDOM , { render } from 'react-dom' ;
import Common from '../ui/common' ;
// import ShareControl from './controller' ;

class Btn extends Component {
	constructor( props ){
		super( props ) ;
		this.state = {
			btn : this.props.options
		}
		console.log( this.state.btn ) ;
	}
	render(){

		let btn = this.state.btn ;
		let sns_icon = <i className="icon" dangerouslySetInnerHTML={{ __html : btn.icon }} /> ;

		return(
			<button type="button" className={btn.class} onClick={btn.clickHandler}>
				{sns_icon}
				{btn.label}
			</button>
		)
	}
}

export { Btn } ;
