"use strict" ; 

import 'babel-polyfill';
import gulp from 'gulp' ; 
import del from 'del' ; 
import webpack from 'gulp-webpack' ; 
import sass from 'gulp-sass' ; 
import cleanCSS from 'gulp-clean-css' ; 
import htmlmin from 'gulp-htmlmin' ; 
import imagemin from 'gulp-imagemin' ; 
import nodemon from 'gulp-nodemon' ; 
import Cache from 'gulp-file-cache' ; 
import babel from 'gulp-babel' ; 
import browserSync from 'browser-sync' ; 
import ejsmin from 'gulp-ejsmin' ; 
import fs from 'fs' ; 
import spritesmith from 'gulp.spritesmith' ; 
import mergeStream from 'merge-stream' ; 
import mustache from 'mustache' ; 
import runSequence from 'run-sequence' ; 
import gaze from 'gaze' ; 
import chokidar from 'chokidar' ; 
import { PATH } from './Dir' ; 
import dir from 'node-dir' ; 

let [ DIR , SRC , DEST , FILENAME , cache , fileArr_js , ] = [
	PATH.DIR , 
	PATH.SRC , 
	PATH.DEST , 
	PATH.FILENAME , 
	new Cache() , 
	[] , 
] ; 

let clean = () => {
	console.log( 'in clean' ) ; 
	return new Promise( ( resolve , reject ) => {
		resolve( del.sync( DIR.DEST ) ) ; 
	}) ; 	
} ; 

let images = () => {
	console.log( 'in images' ) ; 
	return new Promise( ( resolve , reject ) => {
		gulp.src( [SRC.IMAGES , '!' + SRC + '/images/sprite' ] )
			.pipe( gulp.dest( DEST.IMAGES )) ; 
			resolve() ; 
		}) ; 
} ; 

let imagesSprite = () => {
	console.log( 'in imagesSprite' ) ; 
	let createSpriteOptions = function ( dirName ) {
		let mustacheTemplate = './template/sp-mosaic.mustache' ; 
		let spriteOptions = {
			cssOpts : {
				zerounit : function () {
					return function ( text , render ) {
						let value = render(text) ; 
						// return value ; 
						return '0px' === value ? '0' : value ; 
					}
				}
			} , 
			padding : 4 , 
			algorithm : 'binary-tree' , 
			cssTemplate : function ( params ) {
				let template = fs.readFileSync(mustacheTemplate, { encoding : "utf-8" });
				return mustache.render(template, params);
			} , 
			imgPath : '../images/sprite/' + '/sp-' + dirName + '.png' , 
			imgName : 'sp-' + dirName + '.png' , 
			cssName : 'sp-' + dirName + '.scss' , 
			cssSpritesheetName : 'sp-' + dirName  
		} ; 
		return spriteOptions ; 
	} ; 

	return new Promise( ( resolve , reject ) => {
		fs.readdir( SRC.SPRITE + '/' , ( err , fls ) => {
			let arr = [] ; 

			fls.forEach(( dirName ) => {
				let spriteData = gulp.src( SRC.SPRITE + '/' + dirName + '/*.png' )
					.pipe( spritesmith( createSpriteOptions( dirName ) ) ) ; 

				let imgStream = spriteData.img
					.pipe( gulp.dest( 'html_build/images/sprite' ) ) ; 

				let cssStream = spriteData.css
					.pipe( gulp.dest( DIR.SRC + '/scss/ui/sprite' ) ) ; 

				resolve( mergeStream( imgStream , cssStream ) ) ; 
			}) ;  
		}) ; 
	}) ; 
}

let copyImages = gulp.series( images , imagesSprite ) ; 

function webpackFun ( evt ) {
	// console.log( '---- evt : ' , evt ) ; 
	let path = evt.path ; 
	let jsName = path.substr( path.lastIndexOf( '\\' ) + 1 , path.length ) ; 
	let entryName = {} ; 
	let entryPath = {} ; 

	// console.log( 'jsName : ' , jsName ) ; 
	// console.log( 'path : ' , path ) ; 

	if ( path.indexOf( 'ui' ) == -1 ) { /* 상위 */

		// console.log( 'entryName : ' , entryName ) ; 
		// console.log( 'entryPath : ' , entryPath ) ; 
		// console.log( 'jsName : ' , jsName ) ; 

		webpack({
			entry : {
				entryName : __dirname + '/html/js/' + jsName
			} , 
			output : {
				filename : jsName
			} , 
			module : {
				loaders : [
					{
						test : /\.js$/ , 
						loader : 'babel-loader' , 
						exclude : '/node_modules/' , 
						query : {
							cacheDirectory : true , 
							"presets" : ['es2015', 'es2017', 'stage-3', 'react'],
							"plugins" : [
								'transform-decorators-legacy', 
								'transform-class-properties' ,
								'transform-async-to-generator' , 
								'transform-object-assign' , 
								'transform-regenerator' , 
								["transform-runtime", {
									"helpers": false, // defaults to true 
									"polyfill": false, // defaults to true 
									"regenerator": true, // defaults to true 
									"moduleName": "babel-runtime" // defaults to "babel-runtime" 
								}]
							],
						}
					}
				]   
			} 
		}).pipe( gulp.dest( DEST.JS ) ) ; 
	} else { /* 하위 */
		// gulp.watch( SRC.JS , [ 'webpack' ] ) ; 
		fs.readdir( 'html/js/' , ( err , fls ) => {
			let arr = [] ; 
			fls.forEach(( file ) => {
				if ( file.indexOf( '.js' ) > -1 ) {
					// arr.push( file ) ; 
					// let evt = { path : __dirname + '\\html\\js\\' + file } ; 

					let filePath = __dirname + '\\html\\js\\' + file ; 
					let findStr = jsName.replace( '.js' , '' ) ; 
					// console.log( 'filePath : ' , filePath ) ; 
					// console.log( 'file : ' , file ) ; 
					// console.log( 'findStr : ' , findStr ) ; 

					fs.readFile( filePath , 'utf8' , ( err , data ) => {
						if ( err != null ) return console.log( 'err : ' , err ) ; 
						if ( data.indexOf( './ui/' + findStr ) != -1 ) {
							let evt = { path : __dirname + '\\html\\js\\' + file } ; 
							// console.log( 'evt : ' , evt ) ; 
							webpackFun( evt ) ; 
						}
					}) ; 
				}
			}) ;  
		}) ; 
	}
}

gulp.task( 'css:sass' , () => {
	console.log( 'in sass' ) ; 
	return gulp.src( DIR.SRC + '/scss/*.scss' )
		.pipe( cache.filter() )
		.pipe( sass() )
		.pipe( cache.cache() )
		.pipe( gulp.dest( DIR.SRC + '/css' ) ) ; 
})

gulp.task( 'css:css' , () => {
	console.log( 'in css' ) ; 
	return gulp.src( SRC.CSS )
		.pipe( cache.filter() )
		.pipe( cleanCSS({ compatibility : 'ie8' }))
		.pipe( cache.cache() )
		.pipe( gulp.dest( DEST.CSS ) ) ; 
})

let css = gulp.series( 'css:sass' , 'css:css' ) ; 

let htmlSet = () => {
	return gulp.src( SRC.HTML )
		.pipe( htmlmin({ collapceWhitespace : true }))
		.pipe( gulp.dest( DEST.HTML )) ; 
} ; 

let ejsSet = () => {
	console.log( 'in ejsSet' ) ; 
	return gulp.src( SRC.EJS )
		.pipe( gulp.dest( DEST.EJS )) ; 
} ; 
let libSet = () => {
	console.log( 'in libSet' ) ; 
	return gulp.src( SRC.LIB )
		.pipe( gulp.dest( DEST.LIB )) ; 
} ; 
let jsonSet = () => {
	console.log( 'in jsonSet' ) ; 
	return gulp.src( SRC.JSON )
		.pipe( gulp.dest( DEST.JSON )) ; 
} ; 

let webpackSet = () => {
	console.log( 'in webpackSet' ) ; 
	return new Promise( ( resolve , reject ) => {
		fs.readdir( 'html/js/' , ( err , fls ) => {
			console.log( 'err : ' , err ) ; 
			let arr = [] ; 
			fls.forEach(( file ) => {
				if ( file.indexOf( '.js' ) > -1 ) {
					// console.log( 'file : ' , file ) ; 
					let evt = { path : __dirname + '\\html\\js\\' + file } ; 
					webpackFun( evt ) ; 
				}
			}) ;  
		}) ; 
		resolve() ; 
	}) ; 
} ; 

function dataFolderConvertingFunc ( file ) {
	let arr = {} ; 
	arr.originalPath = file ; 
	arr.tmp_arr = file.split( '\\' ) ; 
	arr.fileName = arr.tmp_arr.pop() ; 
	arr.pathArr = arr.tmp_arr.splice( 0 , 1 ) ; 
	arr.pathArr = arr.tmp_arr ; 
	let pattern = /.\w+$/ ; 
	arr.fileName = arr.fileName.replace( pattern , '' ) ; 
	let path = arr.tmp_arr.join( '/' ) ; 
	delete arr.tmp_arr ; 
	return { arr : arr , path : path } ; 
}

let dirchkJS = () => {
	console.log( 'in dirchkJS' ) ; 
	/**현재 js 파일이 담겨있는 폴더의 트리주고를 json 으로 데이터화 합니다.*/
	return new Promise( ( resolve , reject ) => {
		fileArr_js = [] ; 

		dir.readFiles( 'html/js/' , function ( err , content , next ) {
			if (err) throw err;
			next();
		} , function(err, files){
			if (err) throw err;
			files.forEach( function ( file , idx ) {			
				let obj = dataFolderConvertingFunc( file ).arr ; 
				if ( fileArr_js[obj.pathArr.length - 1] == undefined ) {
					fileArr_js[obj.pathArr.length - 1] = [] ; 
				}
				fileArr_js[obj.pathArr.length - 1].push( obj ) ; 
			}) ; 
			resolve() ; 
		}); 
	}) ; 
} ; 

gulp.task( 'start:babel' , () => {
	console.log( 'in babel')
	return new Promise( ( resolve , reject ) => {
	gulp.src( SRC.SERVER )
		.pipe( babel({
			"presets" : ['es2015', 'es2017', 'stage-3'],
			"plugins" : [
				'transform-decorators-legacy', 
				'transform-class-properties' ,
				'transform-async-to-generator' , 
				'transform-object-assign' , 
				'transform-regenerator' , 
				["transform-runtime", {
					"helpers": false, // defaults to true 
					"polyfill": false, // defaults to true 
					"regenerator": true, // defaults to true 
					"moduleName": "babel-runtime" // defaults to "babel-runtime" 
				}]
			],
		}))
		.pipe( gulp.dest( DEST.SERVER ) ) ; 
		resolve () ; 
	}) ;
}) ; 

gulp.task( 'start:nodemon' , () => {
	return new Promise( ( resolve , reject ) => {
		console.log( 'in nodemon')
		nodemon({
			script : DEST.SERVER + '/app.js' , 
			watch : DEST.SERVER 
		}) ; 

		resolve () ; 
	}) ;
}) ; 

let start = gulp.series( 'start:babel' , 'start:nodemon' ) ; 

let browserSyncSet = () => {
	console.log( 'in browserSyncSet' ) ; 
	return new Promise( ( resolve , reject ) => {
		browserSync.init( null , {
			proxy : 'http://localhost:' + DIR.PORT , 
			port : 7000 
		}) ;  

		resolve () ; 
	}) ;  
} ; 

function webpackCompile ( jsName ) {
	webpack({
		entry : {
			entryName : `${__dirname}/html/js/${jsName}.js`
		} , 
		output : {
			filename : `${jsName}.js`
		} , 
		module : {
			loaders : [
				{
					test : /\.js$/ , 
					loader : 'babel-loader' , 
					exclude : '/node_modules/' , 
					query : {
						cacheDirectory : true , 
						"presets" : ['es2015', 'es2017', 'stage-3', 'react'],
						"plugins" : [
							'transform-decorators-legacy', 
							'transform-class-properties' ,
							'transform-async-to-generator' , 
							'transform-object-assign' , 
							'transform-regenerator' , 
							["transform-runtime", {
								"helpers": false, // defaults to true 
								"polyfill": false, // defaults to true 
								"regenerator": true, // defaults to true 
								"moduleName": "babel-runtime" // defaults to "babel-runtime" 
							}]
						],
					}
				}
			]   
		} 
	}).pipe( gulp.dest( DEST.JS ) ) ; 
}

let watch = () => {
	console.log( 'in watch' ) ; 	
	let chkEvtFunc = ( evt , path ) => {
		console.log( '\n\n======================================\ncheck event , path\n----------------------------' ) ; 
		console.log( `evt : ${evt} | path : ${path}` ) ; 
		/* '\\' 경로일 경우 gulp의 dest 명령시 선택된 파일이 복제되는것이아닌 
		선택된 파일을 포함하고있는 경로상의 폴더까지 복제되기 때문에 
		cmd 경로 '\\' 를 js 경로 '/' 로 변경합니다. */

		/**
		@newPath : 전달받은 경로를 \\ 가 아닌 / 로 변경한 새로문 문자열 
		@bln : 파일의 존재 유무 
		@delPath : 삭제되어야할 파일 경로 
		*/
		let [ newPath , bln , delPath ] = [ 
			path.replace( /\\/g , '/' ) , 
			true , 
			null 
		] ; 

		// console.log( 'newPath : ' , newPath ) ; 
		switch( evt ) {
			case 'change' : 
				break ; 
			case 'add' : 
				/*신규 파일이 감지 되었을때 파일 폴더도 새로 확인합니다. 새로 확인된 파일은 
				파일검색에 필요한 배열 fileArr_js 에 추가됩니다. */
				gulp.parallel( dirchkJS )();
				break ; 
			case 'unlink' : 
				bln = false ; 
				break ; 
			default : break ; 
		} 

		if ( !bln ) {
			/*이벤트 타입이 삭제인 경우 빌드폴더에 있는 해당 파일을 삭제합니다.*/
			delPath = newPath.replace( /^html/ , DIR.DEST ) ; 
			if ( fs.existsSync( delPath ) ) {
				fs.unlink( delPath ) ; 
			} else {
				console.log( 'not exists file' ) ; 
			}
		}
		console.log( '======================================\n\n' ) ; 
		return {
			path : newPath , 
			bln : bln , 
		}
	} ; 

	gulp.watch( SRC.EJS ).on( 'all' , ( evt , path , stats ) => {
		let chkInfo = chkEvtFunc( evt , path ) ; 
		if ( chkInfo.bln ) {
			/*이벤트 타입이 삭제인 경우 선택된 파일을 가공하여 
			빌드폴더로 복제합니다.*/
			gulp.src( chkInfo.path )
			.pipe(ejsmin({removeComment: true}))
			.pipe( gulp.dest( DIR.DEST )) ; 
		} 
	}) ; 

	gulp.watch( SRC.SCSS ).on( 'all' , ( evt , path , stats ) => {
		let scssName = path.substr( path.lastIndexOf( '\\' ) + 1 , path.length ).replace( '.scss' , '' ) ; 
		let chkInfo = chkEvtFunc( evt , path ) ; 

		if ( chkInfo.bln ) {
			if ( chkInfo.path.indexOf( 'ui' ) == -1 ) {
				console.log( 'in' ) ; 
				gulp.src( chkInfo.path )
					.pipe( sass() )
					.pipe( gulp.dest( DIR.SRC + '/css' ) ) ; 
			} else {
				console.log( 'out' ) ; 
				fs.readdir( 'html/scss' , ( err , fls ) => {
					let [ i , findStr , len , arr ] = [ 0 , `ui/${scssName}` , fls.length , [] ] ; 
					function chkStr () {
						fs.readFile( 'html/scss/' + fls[i] , 'utf8' , ( err , data ) => {
							if ( i < fls.length -1 ) {
								if ( data.indexOf( findStr ) > -1 ) {
									arr.push( fls[i] ) ; 
								}				

								i += 1 ; 				
								setTimeout(() => {
									chkStr() ; 
								}) ; 
							} else {
								arr.forEach(( str , idx ) => {
									gulp.src( DIR.SRC + '/scss/' + str )
									.pipe( cache.filter() )
									.pipe( sass() )
									.pipe( cache.cache() )
									.pipe( gulp.dest( DIR.SRC + '/css' ) ) ; 
								}) ; 
							}
						}) ; 
					}

					chkStr() ; 
				}) ; 
			}
		} else {
			/*scss 파일의 경우 컴파일 되는 경로가 따로 존재하므로 
			빌드폴더가 아닌 컴파일 폴더의 파일도 삭제하여줍니다.*/
			let delPath = chkInfo.path.replace( /^html_build/ , DIR.SRC ) ; 
			delPath = delPath.replace( /scss/ , 'css' ) ; 
			delPath = delPath.replace( /scss$/ , 'css' ) ; 
			if ( fs.existsSync( delPath ) ) {
				fs.unlink( delPath ) ; 
			} else {
				console.log( 'not exists file' ) ; 
			}
		}
	}) ; 

	gulp.watch( SRC.CSS ).on( 'all' , ( evt , path , stats ) => {
		let chkInfo = chkEvtFunc( evt , path ) ; 
		if ( chkInfo.bln ) {
			gulp.src( chkInfo.path )
				.pipe( cache.filter() )
				.pipe( cleanCSS({ compatibility : 'ie8' }) )
				.pipe( cache.cache() )
				.pipe( gulp.dest( DEST.CSS ) ) ; 
		}
	}) ; 

	gulp.watch( SRC.LIB ).on( 'all' , ( evt , path , stats ) => {
		let chkInfo = chkEvtFunc( evt , path ) ; 
		if ( chkInfo.bln ) {
			gulp.src( chkInfo.path )
				.pipe( gulp.dest( DEST.LIB ) ) ; 
		}
	}) ; 

	gulp.watch( SRC.SERVER ).on( 'all' , ( evt , path , stats ) => {
		let chkInfo = chkEvtFunc( evt , path ) ; 
		if ( chkInfo.bln ) {
			gulp.src( SRC.SERVER )
			.pipe( cache.filter() )
			.pipe( babel({
				"presets" : ['es2015', 'es2017', 'stage-3'],
				"plugins" : [
					'transform-decorators-legacy', 
					'transform-class-properties' ,
					'transform-async-to-generator' , 
					'transform-object-assign' , 
					'transform-regenerator' , 
					["transform-runtime", {
						"helpers": false, // defaults to true 
						"polyfill": false, // defaults to true 
						"regenerator": true, // defaults to true 
						"moduleName": "babel-runtime" // defaults to "babel-runtime" 
					}]
				],
			}))
			.pipe( cache.cache() )
			.pipe( gulp.dest( DEST.SERVER ) ) ; 
		}
	}) ; 

	gulp.watch( SRC.JS ).on( 'all' , ( evt , path , stats ) => {
		let chkInfo = chkEvtFunc( evt , path ) ; 
		if ( chkInfo.bln ) {

			let evtPath = chkInfo.path
			let originalPath = chkInfo.path ; 
			let pathArr = originalPath.split( '/' ) ; 
			let fileName = pathArr.pop().replace( /\.js$/ , '' ) ; 
			pathArr.shift() ; 
			let crntDatas = [
				{
					originalPath : originalPath , 
					fileName : fileName , 
					pathArr : pathArr , 
				} , 
			] ; 

			// console.log( 'evtPath : ' , evtPath ) ; 
			// console.log( 'originalPath : ' ,  originalPath ) ; 
			// console.log( 'crntDatas : ' ,  crntDatas ) ; 

			function chkFileArrFunc ( file , cData ) {
				let p = new Promise(( resolve , reject ) => {
					fs.readFile( file.originalPath , 'utf8' , ( err , fileData ) => {
						let re = new RegExp( '^import.*?\/' + cData.fileName , 'gm' );
						let result = re.exec( fileData ) ; 
						console.log( 'result : ' , result ) ; 
						if ( result != null ) {
							resolve( file ) ; 
						} else {
							resolve( null ) ; 
						}
					}) ; 

				}) ; 

				return p ; 
			}

			function chkDirArrFunc ( cData ) {
				let p = new Promise(( resolve , reject ) => {
					if ( cData.pathArr.length == 1 ) {
						webpackCompile( cData.fileName ) ; 
					} else {
						let promises = [] ; 

						fileArr_js[cData.pathArr.length - 2].forEach(( fileInfo ) => {
							promises.push( chkFileArrFunc( fileInfo , cData ) ) ; 
						}) ; 

						Promise.all( promises ).then(( result ) => {
							result = result.filter(( rlstData ) => {
								return rlstData != null ; 
							}) ; 

							if ( result.length == 0 ) {
								let promises = [] ; 
								fileArr_js[cData.pathArr.length - 1].forEach(( fileInfo ) => {
									promises.push( chkFileArrFunc( fileInfo , cData ) ) ; 
								}) ; 

								Promise.all( promises ).then(( result ) => {
									result = result.filter(( rlstData ) => {
										return rlstData != null ; 
									}) ; 

									if ( result.length == 0 ) {
										console.log( 'import된 상위 js파일이 존재하지 않습니다. import 하고싶은 파일을 설정하여주십시오.' ) ; 
									} else {
										resolve( result ) ; 
									}
								}) ; 

							} else {
								resolve( result ) ; 
							}
						}) ; 
					}
				}) ; 

				return p ; 
			}

			function stepStart () {
				let promises = [] ; 
				crntDatas.forEach(( cData , idx ) => {
					promises.push( chkDirArrFunc( cData ) ) ; 
				}) ; 

				Promise.all( promises ).then(( result ) => {
					let resultDatas = result[0] ; 
					resultDatas = resultDatas.filter(( data ) => {
						return data != null ; 
					})

					if ( resultDatas[0].pathArr.length > 1 ) {
						crntDatas = resultDatas ; 
						stepStart() ; 
					} else {
						console.log( '\n\n ------- end : file checked ------' ) ; 
						console.log( 'resultDatas : \n\n' , resultDatas ) ; 
						console.log( '\n\n ------- end : file checked ------' ) ; 
						resultDatas.map(( rlstData , idx ) => {
							webpackCompile( rlstData.fileName ) ; 
						}) ; 
					}
				}) ; 
			}
			stepStart() ; 
		} // end of if
	}) ; 

	gulp.watch( DIR.DEST + '/**/*.*' ).on( 'change' , ( evt ) => {
		browserSync.reload() ; 
	}) ; 
	gulp.watch( 'app/**/*.*' ).on( 'change' , ( evt ) => {
		browserSync.reload() ; 
	}) ; 
} ; 

let watch2 = () => {
	console.log( 'in watch' ) ; 	
	let chkEvtFunc = ( evt , path ) => {
		console.log( '\n\n======================================\ncheck event , path\n----------------------------' ) ; 
		console.log( `evt : ${evt} | path : ${path}` ) ; 
		/* '\\' 경로일 경우 gulp의 dest 명령시 선택된 파일이 복제되는것이아닌 
		선택된 파일을 포함하고있는 경로상의 폴더까지 복제되기 때문에 
		cmd 경로 '\\' 를 js 경로 '/' 로 변경합니다. */

		/**
		@newPath : 전달받은 경로를 \\ 가 아닌 / 로 변경한 새로문 문자열 
		@bln : 파일의 존재 유무 
		@delPath : 삭제되어야할 파일 경로 
		*/
		let [ newPath , bln , delPath ] = [ 
			path.replace( /\\/g , '/' ) , 
			true , 
			null 
		] ; 

		// console.log( 'newPath : ' , newPath ) ; 
		switch( evt ) {
			case 'change' : 
				break ; 
			case 'add' : 
				/*신규 파일이 감지 되었을때 파일 폴더도 새로 확인합니다. 새로 확인된 파일은 
				파일검색에 필요한 배열 fileArr_js 에 추가됩니다. */
				gulp.parallel( dirchkJS )();
				break ; 
			case 'unlink' : 
				bln = false ; 
				break ; 
			default : break ; 
		} 

		if ( !bln ) {
			/*이벤트 타입이 삭제인 경우 빌드폴더에 있는 해당 파일을 삭제합니다.*/
			delPath = newPath.replace( /^html/ , DIR.DEST ) ; 
			if ( fs.existsSync( delPath ) ) {
				fs.unlink( delPath ) ; 
			} else {
				console.log( 'not exists file' ) ; 
			}
		}
		console.log( '======================================\n\n' ) ; 
		return {
			path : newPath , 
			bln : bln , 
		}
	} ; 

	let makeCrntData = ( path ) => {
		/**
		@evtPath : 현재 저장된 파일의 실제경로
		@originalPath : 가공되지 않은 evtPath의 파일 실제경로의 원본
		@pathArr : 파일이 저장되어있는 경로를 구조별로 배열형태로 저장
		@fileName : 현재 저장된 파일명
		@crntData : 저장된 파일의 정보를 토대로 가공한 데이터
		*/

		let [
			evtPath , 
			originalPath , 
			pathArr , 
			fileName , 
			crntData , 
		] = [
			path , 
			path , 
			null , 
			null , 
		] ; 

		/*전달받은 경로를 토대로 필요한 데이터를 가공합니다.*/
		pathArr = originalPath.split( '/' ) ; 
		fileName = pathArr.pop().replace( /\.js$/ , '' ) ; 
		pathArr.shift() ; // 가장 앞에 오는 경로인 'html' 은 불필요하므로 삭제합니다.
		/*가공된 데이터는 crntData 오브젝트에 정리하여 담아둡니다.*/
		crntData = [{
			originalPath : originalPath , 
			fileName : fileName , 
			pathArr : pathArr , 
		}] ; 

		return crntData ; 
	}

	let chkFileArrFunc = ( file ) => {
		console.log( 'file : ' , file ) ; 
	}

	let searchFunc = ( crntData ) => {
		let tempIdx = 0 ; 
		let p = new Promise(( resolve , reject ) => {
			let findArr = [] ; 

			console.log( 'crntData : ' , crntData ) ; 

			if ( crntData.pathArr.length == 1 && crntData.pathArr[0] == 'js' ) {
				/**현재 검색되어야 하는 파일이 최상위 파일인 경우 모든 검색을 멈추고 
				바로 컴파일 될 준비를 합니다.

				@crntData : ( Object ) 현재파일 정보 
				@srch : ( bool ) true -> 검색을 계속 해야함. false -> 검색을 마침
				*/

				console.log( '최상위 파일입니다.' ) ; 
				resolve({ crntData : crntData , srch : false }) ; 
			} else {
				fileArr_js[crntData.pathArr.length - 1].map( ( fileInfo , idx , arrOrigin ) => {
					tempIdx += 1 ; 

					fs.readFile( fileInfo.originalPath , 'utf8' , ( err , fileData ) => {
						let re = new RegExp( '^import.*?\/' + crntData.fileName , 'gm' );
						let result = re.exec( fileData ) ; 

						if ( result != null ) {
							findArr.push( fileInfo ) ; 
						}

						if ( arrOrigin.length == tempIdx && findArr.length != 0 ) {
							console.log( 'ok' ) ; 
							resolve( findArr ) ; 
						} else {
							console.log( 'no' ) ; 
							reject( 'chked' ) ; 
						}
					}) ; 
				}) ; 
			}
		}) ; 
		return p ; 
	}

	let crntDatasSearchFunc = ( chkInfo ) => {
		/**
		@crntDatas : ( Array ) 현재 저장된 파일의 가공된 데이터 
		@makeCrntData : ( Function ) 현재 저장된 파일경로를 바탕으로 검색해야할 오브젝트를 만들어 반환해줍니다.
		@searchFunc : ( Function ) 전달받은 데이터의 폴더 경로에 들어있는 파일들에서 현재 파일을 import 가 존재하는지를 검사합니다.
		*/

		/*makeCrntData 에서 반환받은 crntDatas 를 바탕으로 현재 파일을 import 받는 파일이 있는 같은 뎁스의 경로를 
		시작으로 상위폴더를 검색합니다. */

		let crntDatas = makeCrntData( chkInfo.path ) ; 
		crntDatas.map( crntData => {
			searchFunc( crntData )
				.then( result => {
					console.log( '==================\nsuccess\n------------------------' ) ; 
					console.log( 'result.crntData : ' , result.crntData ) ; 
					console.log( 'result.srch : ' , result.srch ) ; 

					if ( !result.srch ) {
						webpackCompile( result.crntData.fileName ) ; 
					}
				} , reason => {
					console.log( '==================\nfail\n------------------------' ) ; 
					console.log( 'bb' , reason ) ; 
				}) ; 
		}) ; 		
	} ; 

	gulp.watch( SRC.JS ).on( 'all' , ( evt , path , stats ) => {
		let chkInfo = chkEvtFunc( evt , path ) ; 
		if ( chkInfo.bln ) {
			crntDatasSearchFunc( chkInfo ) ; 
		}
	}) ; 
} ; 

gulp.task( 'watchTest' , gulp.series( dirchkJS , watch2 ) ) ; 

gulp.task( 'default' , gulp.series( [ clean , webpackSet , copyImages , css , htmlSet , ejsSet , libSet , jsonSet , 
	dirchkJS , 
	start , 
	browserSyncSet , 
	watch , 
] )) ; 