//	http://coding.smashingmagazine.com/2010/05/23/make-your-own-bookmarklets-with-jquery/

//	needs:		throttling
//	could use:	cleanup, browser testing for resizing and tabs
//	breaks on: http://html5doctor.com/native-drag-and-drop/

(function(){

	var v = "1.7";

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

	function initAddCss($) {
	
		window.addCss = function() {

			var $ = window.jQuery;

			if (document.getElementById("txtAddCss")) {
				$("#txtAddCss").toggle();
				return false;
			}

			// http://stackoverflow.com/questions/263743/how-to-get-cursor-position-in-textarea
			function getCaret(a){if(a.selectionStart){return a.selectionStart}else if(document.selection){a.focus();var b=document.selection.createRange();if(b==null){return 0}var c=a.createTextRange(),d=c.duplicate();c.moveToBookmark(b.getBookmark());d.setEndPoint("EndToStart",c);return d.text.length}return 0};
			function setCaret(a,b){if(a.setSelectionRange){a.setSelectionRange(b,b)}else if(input.createTextRange){var c=a.createTextRange();c.collapse(true);c.moveEnd("character",b);c.moveStart("character",b);c.select()}}

			// taken from Modernizr, I think.
			var bHasLocal = (function(){try{return"localStorage"in window&&window["localStorage"]!==null}catch(a){return false}})();

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
				background: "rgba(0,0,0,.9)",
				color: "#fff",
				border: "1px solid #000",
				outline: "none",
				width: "400px",
				height: "200px",
				font: "13px/18px \"Courier New\", Courier, \"Lucida Sans Typewriter\", \"Lucida Typewriter\", monospace",
				padding: "10px",
				overflow: "auto",
				resize: "none"
			}).bind("keyup change", function(){
				var sCss = $txt.val();
				$style.html(sCss);
				if (bHasLocal) { localStorage.addCss = sCss; }
			}).bind("keydown", function(e){
				if (e.which === 27) {
					$txt.toggle();
				} else if (e.which === 9) {
					var sVal = $txt.val(),
						iCaret = getCaret($txt[0]);
					$txt.val(sVal.substr(0, iCaret) + "\t" + sVal.substr(iCaret));
					iCaret++;
					setCaret($txt[0], iCaret);
					return false;
				};
			}).appendTo($container).focus();
			
			if (bHasLocal) {
				if (localStorage.addCss) { $txt.val(localStorage.addCss).change(); }
				if (localStorage.addCssCss) { $txt.css($.parseJSON(localStorage.addCssCss)); }
			}

			// vars and event handlers for resizing
			var pos = { start: {}, diff: {} }, css = { start: { width: $txt.width(), height: $txt.height() }, end: { width: undefined, height: undefined } };
			var fn = {
				startDrag: function(e) {
					pos.start = {
						x: e.clientX || e.pageX,
						y: e.clientY || e.pageY
					};
					$(document).on("mousemove", fn.onMouseMove);
					$(document).on("mouseup", fn.endDrag);
					return false;
				},
				onMouseMove: function(e) {
					pos.diff.x = pos.start.x - (e.clientX || e.pageX);
					pos.diff.y = pos.start.y - (e.clientY || e.pageY);
					css.end.width = css.start.width + pos.diff.x;
					css.end.height = css.start.height + pos.diff.y;
					$txt.css(css.end);
				},
				endDrag: function(e) {
					if (bHasLocal) { localStorage.addCssCss = JSON.stringify(css.end); }
					pos.diff = {
						x: 0,
						y: 0
					}, css = {
						start: {
							width: $txt.width(),
							height: $txt.height()
						}, end: {
							width: undefined,
							height: undefined
						}
					};
					$(document).off("mousemove", fn.onMouseMove);
					$(document).off("mouseup", fn.endDrag);
					return false;
				}
			};

			// resize handle
			var $handle = $("<span id='spAddCssHandle' />").css({
				border: "8px solid #fff",
				position: "absolute",
				top: 0,
				left: 0,
				"border-right-color": "transparent",
				"border-bottom-color": "transparent",
				opacity: ".1",
				cursor: "nw-resize"
			}).appendTo($container).on("mousedown", fn.startDrag);

		};				// window.addCss
		window.addCss();

	}					// initAddCss

})();					// iife