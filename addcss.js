//	could use:  code cleanup, browser testing
//	bugs:       tabs in opera, wonky txt resize after window resize

(function(){

	"use strict";

	function initAddCss($) {
	
		window.addCss = function() {

			var $ = $ || window.jQuery,
				$window = $(window),
				$document = $(document),
				throttle = {};

			if (document.getElementById("txtAddCss")) {
				$("#txtAddCss").toggle();
				return false;
			}

			var iThrottle = 500;

			var supports = {
				localStorage: (function(){
					try {
						return "localStorage" in window && window["localStorage"] !== null;
					} catch (a) {
						return false;
					}
				}()),
				dynamicStyle: true
			};

			var $container = $("<div />", {
				id: "containerAddCss"
			}).appendTo($("body"));

			// load LESS if browser doesn't already have it
			// (not bothering here w/ versioning. ping me if it matters for you)
			var parser = {
				parse: function (s) {
					updateCss(s);
				},
				replace: function() {
					parser = new less.Parser();
				}
			};
			if (window.less && window.less.Parser) {
				parser.replace();
			} else {
				$.getScript("http://cdnjs.cloudflare.com/ajax/libs/less.js/1.3.0/less-1.3.0.min.js", parser.replace);
			}

			var $style = $("<style />", {
				id: "styleAddCss"
			}).html("/**/").appendTo($("body"));

			var $txt = $("<textarea />", {
				id: "txtAddCss",
				spellcheck: false
			}).appendTo($container);

			$("<link />", {
				rel: "stylesheet",
				type: "text/css",
				href: (location.hostname.match("localhost") &&
					document.title.match("Add CSS Bookmarklet")) ? "/addcss.css" :
					"http://rocktronica.github.com/Add-CSS-Bookmarklet/addcss.min.css"
			}).appendTo($container).on("load", function() {
				$txt.focus();
			});

			var $handle = $("<span />", {
				id: "spAddCssHandle"
			}).appendTo($container);

			// determine if browser can handle dynamic style elements (cough, cough, IE8)
			if (document.getElementById("styleAddCss").innerHTML !== "/**/") {
				supports.dynamicStyle = false;
				// safe to assume we also shouldn't update as often
				iThrottle = 1000;
			}

			var updateLess = function(sContext) {
				// overkill?
				try {
					parser.parse(sContext, function (err, tree) {
						if (err) { return false; }
						updateCss(tree.toCSS());
						if (supports.localStorage) {
							localStorage.addCss = sContext;
						}
					});
				} catch(err) {
				}
			};

			var updateCss = function(sCss) {
				if (supports.dynamicStyle) {
					$style.html(sCss);
				} else { // better way to do this?
					$style.replaceWith("<style id='styleAddCss'>" + sCss + "</style>");
					$style = $(document.getElementById("styleAddCss"));
				}
			};

			// key events
			(function(){

				var KEYS = {
					ESC: 27,
					TAB: 9
				};

				// http://stackoverflow.com/questions/263743/how-to-get-cursor-position-in-textarea
				function getCaret(a){if(a.selectionStart){return a.selectionStart;}else if(document.selection){a.focus();var b=document.selection.createRange();if(b==null){return 0;}var c=a.createTextRange(),d=c.duplicate();c.moveToBookmark(b.getBookmark());d.setEndPoint("EndToStart",c);return d.text.length;}return 0;}
				function setCaret(a,b){if(a.setSelectionRange){a.setSelectionRange(b,b);}else if(a.createTextRange){var c=a.createTextRange();c.collapse(true);c.moveEnd("character",b);c.moveStart("character",b);c.select();}}
	
				$txt.bind("keyup change", function(){
					throttle.keyup = throttle.keyup || setTimeout(function(){
						var sCss = $txt.val();
						updateLess(sCss);
						throttle.keyup = undefined;
					}, iThrottle);
				}).bind("keydown", function(e){
					var key = e.which;
					if (key === KEYS.ESC) {
						$txt.toggle();
					} else if (key === KEYS.TAB) {
						var sVal = $txt.val(),
							iCaret = getCaret($txt[0]);
						$txt.val(sVal.substr(0, iCaret) + "\t" + sVal.substr(iCaret));
						iCaret++;
						setCaret($txt[0], iCaret);
						return false;
					}
				});
			
			}());
			
			if (supports.localStorage) {
				if (localStorage.addCss) {
					$txt.val(localStorage.addCss).change();
				}
				if (localStorage.addCssCss) {
					$txt.css($.parseJSON(localStorage.addCssCss));
				}
			}

			// resizing
			(function(){

				var pos = { start: {}, diff: {} },
					css = {
						start: { width: $txt.width(), height: $txt.height() }, 
						end: { width: undefined, height: undefined }
					};

				function fixToScreen(){
					var iOffset = 40;
					var window = { width: $window.width(), height: $window.height() };
					var text = { width: $txt.width(), height: $txt.height() };
					if (window.width < text.width + iOffset) {
						var iNewWidth = window.width - iOffset;
						$txt.css("width", iNewWidth);
						css.start.width = iNewWidth;
					}
					if (window.height < text.height + iOffset) {
						var iNewHeight = window.height - iOffset;
						$txt.css("height", iNewHeight);
						css.start.height = iNewHeight;
					}
					throttle.windowResize = undefined;
				}
	
				var fn = {
					startDrag: function(e) {
						pos.start = {
							x: e.clientX || e.pageX,
							y: e.clientY || e.pageY
						};
						$document.on("mousemove", fn.onMouseMove)
							.on("mouseup", fn.endDrag)
							.on("keypress", fn.endDrag);
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
						if (supports.localStorage) { localStorage.addCssCss = JSON.stringify(css.end); }
						pos.diff = {
							x: 0,
							y: 0
						};
						css = {
							start: {
								width: $txt.width(),
								height: $txt.height()
							}, end: {
								width: undefined,
								height: undefined
							}
						};
						$document.off("mousemove", fn.onMouseMove)
							.off("mouseup", fn.endDrag)
							.off("keypress", fn.endDrag);
						fixToScreen();
						return false;
					}
				};
				
				$handle.on("mousedown", fn.startDrag);

				$window.on("resize", function(){
					throttle.windowResize = throttle.windowResize || setTimeout(fixToScreen, 10);
				}).resize();

			}());

		}; // window.addCss
		window.addCss();

	} // initAddCss

	var v = "1.7";
	if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
		var done = false;
		var script = document.createElement("script");
		script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
		script.onload = script.onreadystatechange = function(){
			if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
				done = true;
				initAddCss(jQuery);
			}
		};
		document.getElementsByTagName("head")[0].appendChild(script);
	} else {
		initAddCss(jQuery);
	}

}()); // iife