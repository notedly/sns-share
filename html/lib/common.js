Array.prototype.valueIndex=function(pval) {
   let idx = -1;
   if(this==null || this==undefined || pval==null || pval==undefined){
   }else{
      for(var i=0;i<this.length;i++){
         if(this[i]==pval){
            idx = i;
            break;
         }
      }
   }
   return idx
};

Array.prototype.removeDup=function() {
   var resultArray = [];
   if(this==null || this==undefined){
   }else{
      for(var i=0;i<this.length;i++){
         var el = this[i];
         if(resultArray.valueIndex(el) === -1) resultArray.push(el);
      }
   }
   return resultArray;
}

if(!Array.prototype.counter) {
    let counter = {
        get : function() {
            let arr = this
            ;
            
            // let counter = function(arr, cnt, recent, callback, start=0){
            let counter = function(cnt, recent, callback, start=0){
                let dir = cnt/Math.abs(cnt);
                let result = [];
                let loop = true;

                cnt = Math.abs(cnt);
                recent = recent + (dir*start);

                for(let i=0; i<cnt; i++){
                    result[i] = arr[ (arr.length + recent + (i*dir)) % arr.length ];
                    if(typeof callback == "function"){
                        loop = callback(result[i], i);
                        if(loop === false) break;
                    }
                }    
                return result;
            }

            return counter;
        }
    }

    Object.defineProperty(Array.prototype, 'counter', counter);
}

if(!document.documentElement.findIndex){
   let findIndexPorperty = {
      get : function(){
         let element = this
         ,  parentNode = this.parentNode
         ,  siblings = parentNode.children
         ,  findIndex 
         ,  indexOf = Array.prototype.indexOf
         ;

         findIndex = function(){
            return indexOf.call(siblings, element);
         }

         return findIndex;
      }
   }

   Object.defineProperty(Element.prototype, 'findIndex', findIndexPorperty);
}

if(!NodeList.prototype.findIndex){
   let findIndexNodeList = {
      get : function(){
         let elements = this
         ,  findIndex
         ,  indexOf = Array.prototype.indexOf
         ;

         findIndex = function(element){
            return indexOf.call(elements, element);
         }
      }
   }

   Object.defineProperty(NodeList.prototype, 'findIndex', findIndexNodeList); 
}

export let AjaxLoad = (() => {
   let xhttp;
   let ajaxLoaded = false;
   let stack = [];

   if (window.XMLHttpRequest) { // 모질라, 사파리등 그외 브라우저, ...
      xhttp = new XMLHttpRequest();
   } else if (window.ActiveXObject) { // IE 8 이상
      xhttp = new ActiveXObject("Microsoft.XMLHTTP");
   }

   return function(){
      stack.push({ url : arguments[0] , callback : arguments[1] }) ; 
      function call () {
         if ( ajaxLoaded ) return ; 
         if ( stack.length == 0 ) return ; 
         ajaxLoaded = true ; 
         let obj = stack[0] ; 

         /* html 아작스 로딩 */
         xhttp.onreadystatechange = function () {
            if ( xhttp.readyState ===4 && xhttp.status === 200 ) {
               let cont = xhttp.responseText ; 
               obj.callback( cont ) ; 
               stack.shift() ; 
               ajaxLoaded = false ; 
               call() ; 
            }
         } ; 

         xhttp.dateType = 'script' ; 
         xhttp.open( 'GET' , obj.url , true ) ; 
         xhttp.send() ; 
      }
      call() ;
   }

})();

export let AjaxLoadPost = (() => {
    let xhttp;
    let ajaxLoaded = false;
    let stack = [];

    if (window.XMLHttpRequest) { // 모질라, 사파리등 그외 브라우저, ...
         xhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE 8 이상
         xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    return function(){
         stack.push({ url : arguments[0] , data : arguments[1] , callback : arguments[2] }) ; 

         function call () {
             console.log( 'ajaxLoaded : '  , ajaxLoaded , 'stack.length : ' , stack.length ) ; 
             if ( ajaxLoaded ) return ; 
             if ( stack.length == 0 ) return ; 
             ajaxLoaded = true ; 
             let obj = stack[0] ;

             xhttp.onreadystatechange = function () {
                  if ( xhttp.readyState ===4 && xhttp.status === 200 ) {
                      let cont = xhttp.responseText ; 
                      obj.callback( cont ) ; 
                      stack.shift() ; 
                      ajaxLoaded = false ; 
                      call() ; 
                  }
             } ; 

             // console.log( obj.data ) ; 

             // xhttp.dateType = 'script' ; 
             xhttp.open( 'POST' , obj.url , true ) ; 
             xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
             xhttp.send( obj.data ) ; 
         }
         call() ;
    }
})();

export let AjaxLoadGet = (() => {
    let xhttp;
    let ajaxLoaded = false;
    let stack = [];

    if (window.XMLHttpRequest) { // 모질라, 사파리등 그외 브라우저, ...
         xhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE 8 이상
         xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    return function(){
         stack.push({ url : arguments[0] , data : arguments[1] , callback : arguments[2] }) ; 

         function call () {
             console.log( 'ajaxLoaded : '  , ajaxLoaded , 'stack.length : ' , stack.length ) ; 
             if ( ajaxLoaded ) return ; 
             if ( stack.length == 0 ) return ; 
             ajaxLoaded = true ; 
             let obj = stack[0] ;

             xhttp.onreadystatechange = function () {
                  if ( xhttp.readyState ===4 && xhttp.status === 200 ) {
                      let cont = xhttp.responseText ; 
                      obj.callback( cont ) ; 
                      stack.shift() ; 
                      ajaxLoaded = false ; 
                      call() ; 
                  }
             } ; 

             // console.log( obj.data ) ; 

             // xhttp.dateType = 'script' ; 
             xhttp.open( 'GET' , obj.url , true ) ; 
             xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
             xhttp.send( obj.data ) ; 
         }
         call() ;
    }
})();

export function RandomRange(min, max){
   return Math.random()* (max-min) + min;
}

export class ChkText {
  constructor () {
    this.p = (() => {
      let elem_p = document.createElement( 'p' ) ; 
      elem_p.classList.add( 'alarmText' ) ; 
      return elem_p ; 
    })() ; 

    this.opt = {
      duration : 2000 
    } ; 

  }

  add ( text , elem_tag ) {
    let mine = this ; 
    this.p.textContent = text ; 
    elem_tag.appendChild( this.p ) ; 

    setTimeout( () => {
      if ( document.body.contains( mine.p ) ) {
        mine.p.parentNode.removeChild( mine.p ) ; 
      }
    } , mine.opt.duration ) ; 
  }

  clear () {
    let mine = this ; 
    if ( document.body.contains( mine.p ) ) {
      mine.p.parentNode.removeChild( mine.p ) ; 
    }
    console.log( 'clear' ) ; 
  }
}

/* Custom event polyfill */
(function () {

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

export class PromiseSetter {

  constructor () {
    let This = this;

    this.resolve;
    this.reject;
    
    this.promise = new Promise ( (resolve, reject)=>{
      console.log("Promise Setter : " , this);
      This.resolve = resolve;
      This.reject = reject;
    } );
  }
}