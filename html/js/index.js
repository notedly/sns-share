import React , { Component } from 'react' ;
import ReactDOM , { render } from 'react-dom' ;
import Common from './ui/common' ;
import {Controller} from './share/controller' ;
import {Btn} from './share/btn' ;

class IndexContainer extends Component {
	constructor( props ){
		super( props ) ;

		this.btns = [
			{
				type : 'facebook' ,
				label : '페이스북에 공유하기' ,
				class : 'btn' ,
			} ,
			{
				type : 'twitter' ,
				label : '트위터에 공유하기' ,
				class : 'btn' ,
			}
		] ;
	}
	render(){
		let makeSnsBtn = ( btn , idx ) => {
			let snsProps = {
				key : `btn${idx}` ,
				options : {
					type : btn.type ,
					label : btn.label ,
					class : btn.class
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



