let DIR = {
	SRC : 'html' , 
	DEST : 'html_build' , 
	PORT : 8001 , 
} ; 

module.exports = {
	PATH : {
		DIR : DIR , 
		SRC : {
			JS : DIR.SRC + '/js/**/*.js' , 
			CSS : DIR.SRC + '/css/*.css' , 
			SCSS : DIR.SRC + '/scss/**/*.scss' , 
			HTML : DIR.SRC + '/**/*.html' , 
			LIB : DIR.SRC + '/lib/*.js' , 
			JSON : DIR.SRC + '/json/*.json' , 
			IMAGES : DIR.SRC + '/images/*' , 
			EJS : DIR.SRC + '/**/*.ejs' , 
			SERVER : 'server/**/*.js' , 
			SPRITE : DIR.SRC + '/images/sprite' , 
		} , 
		DEST : {
			JS : DIR.DEST + '/js' , 
			LIB : DIR.DEST + '/lib' , 
			JSON : DIR.DEST + '/json' , 
			CSS : DIR.DEST + '/css' , 
			HTML : DIR.DEST + '/' , 
			IMAGES : DIR.DEST + '/images' , 
			EJS : DIR.DEST + '/' , 
			SERVER : 'app' , 
			SPRITE : DIR.DEST + '/images/sprite' , 
		} , 
		FILENAME : {
			SCSS : 'bundle.scss' , 
			CSS : 'bundle.css'
		} , 
	}
} ; 