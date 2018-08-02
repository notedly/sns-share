import express from 'express' ; 
import session from 'express-session' ; 
import mysql from 'mysql' ; 
import ejs from 'ejs' ; 
import fs from 'fs' ; 
import { PATH } from '../dir' ; 

const app = express() ; 
app.set( 'views' , __dirname + '/../html_build/' ) ; 
app.set( 'view engine' , 'ejs' ) ; 
app.engine( 'html' , require( 'ejs' ).renderFile ) ;  
app.use( '/' , express.static( __dirname + '/../html_build' )) ; 

let DIR = PATH.DIR ; 

app.get( '/' , ( req , res ) => {
	console.log( 'index in' ) ; 
	res.render( 'index' , {}) ; 
}) ; 

const server = app.listen( DIR.PORT , () => {
	console.log( 'Express listening on port : ' +  server.address().port) ;
}) ; 