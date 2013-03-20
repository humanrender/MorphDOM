;var Browser = (function(window, Browser){
  // $.browser polyfill  
  Browser._browser = $.browser || (function(){var a,c,b;b=function(e){e=e.toLowerCase();var d=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:d[1]||"",version:d[2]||"0"}};a=b(navigator.userAgent);c={};if(a.browser){c[a.browser]=true;c.version=a.version}if(c.chrome){c.webkit=true}else{if(c.webkit){c.safari=true}}return c})();  
  
  Browser.not_msie = function(){
    return !Browser._browser.msie;
  }
  
  Browser.is_msie = function(conditional){
    var code = "return !!Browser._browser.msie"
    if(conditional)
      code += " && parseFloat(Browser._browser.version) "+conditional;
    return (new Function("obj", code))();
  };

  Browser.supports_animation = function(){
    var supports = Browser.not_msie() || Browser.is_msie(">= 9");
    Browser.supports_animation = function(){
      return supports;
    }
    return supports;
  };
  
  return Browser;
})(window, {});
