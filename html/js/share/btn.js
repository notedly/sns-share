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
	}
	render(){
		let btn = this.state.btn ;
		return(
			<button type="button" className={btn.class} onClick={btn.clickHandler}>{btn.label}</button>
		)
	}
}

export { Btn } ;
