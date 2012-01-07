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
				initAddCss();
			}
		};
		document.getElementsByTagName("head")[0].appendChild(script);
	} else {
		initAddCss();
	}

	function initAddCss() {
		(window.AddCss = function() {

			var $txt;

			if (document.getElementById("txtAddCss")) {
				$("#txtAddCss").toggle();
				return false;
			}

			var hasLocalStorage = (function(){
				try {
					return 'localStorage' in window && window['localStorage'] !== null;
				} catch (e) {
					return false;
				};
			})();

			var container = $("<div />").css({
				position: "fixed",
				bottom: "10px",
				right: "10px",
				background: "#333",
				"z-index": "1000"
			}).appendTo($("body"));

			var $style = $("<style />").appendTo($("body"));

			$txt = $("<textarea id='txtAddCss' spellcheck='false' />").css({
				resize: "both",
				display: "block",
				background: "#111",
				color: "#fff",
				border: "none",
				width: "400px",
				height: "200px",
				font: "13px/18px \"Courier New\", Courier, \"Lucida Sans Typewriter\", \"Lucida Typewriter\", monospace",
				padding: "10px",
				overflow: "auto"
			}).bind("keyup change", updateCss).appendTo(container);

			function updateCss() {
				var sCss = $txt.val();
				$style.html(sCss);
				if (hasLocalStorage) { localStorage["css"] = sCss; }
			}

			$txt.focus();

			if (hasLocalStorage) {
				if ((localStorage["css"] !== null) && (localStorage["css"] !== undefined)) {
					$txt.val(localStorage["css"]).change();
				}
			}

			if ($txt.val().trim() === "") {
				$txt.val("/* Edit me! */\n\nbody {\n\tbackground: #F5F5F5;\n\tcolor: #333;\n}").change();
			}

		})();
	}

})();