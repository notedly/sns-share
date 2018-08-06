import React , { Component } from 'react' ;
import ReactDOM , { render } from 'react-dom' ;
import Common from '../ui/common' ;
// import ShareControl from './controller' ;

class Btn extends Component {
	constructor( props ){
		super( props ) ;
		this.state = {
			btns : this.props.options
		}
	}
	render(){
		let opts = this.state.btns ;
		return(
			<button type="button" className={opts.class} onClick={opts.clickHandler}>{opts.label}</button>
		)
	}
}

export { Btn } ;
