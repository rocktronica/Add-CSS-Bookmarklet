// http://coding.smashingmagazine.com/2010/05/23/make-your-own-bookmarklets-with-jquery/

(function(){

	var v = "1.3.2";

	if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
		var done = false;
		var script = document.createElement("script");
		script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
		script.onload = script.onreadystatechange = function(){
			if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
				done = true;
				initAddCss(jQuery);
			}
		};
		document.getElementsByTagName("head")[0].appendChild(script);
	} else {
		initAddCss(jQuery);
	}

	function initAddCss() {
		(window.AddCss = function($) {

			if (document.getElementById("txtAddCss")) {
				$("#txtAddCss").toggle();
				return false;
			}

			var bHasLocal = (function(){
				try {
					return 'localStorage' in window && window['localStorage'] !== null;
				} catch (e) {
					return false;
				};
			})();

			var $container = $("<div />").css({
				position: "fixed",
				bottom: "10px",
				right: "10px",
				"z-index": "1000"
			}).appendTo($("body"));

			var $style = $("<style />").appendTo($("body"));

			var $txt = $("<textarea id='txtAddCss' spellcheck='false' />").css({
				resize: "both",
				display: "block",
				background: "#111",
				color: "#fff",
				border: "1px solid #000",
				outline: "none",
				width: "400px",
				height: "200px",
				font: "13px/18px \"Courier New\", Courier, \"Lucida Sans Typewriter\", \"Lucida Typewriter\", monospace",
				padding: "10px",
				overflow: "auto"
			}).bind("keyup change", function(){
				var sCss = $txt.val();
				$style.html(sCss);
				if (bHasLocal) { localStorage.addCss = sCss; }
			}).bind("keydown", function(e){
				if (e.which === 27) {
					$txt.toggle();
				}
			}).appendTo($container).focus();

			if (bHasLocal) {
				if (localStorage.addCss) {
					$txt.val(localStorage.addCss).change();
				}
			}

		})(jQuery);
	}

})();