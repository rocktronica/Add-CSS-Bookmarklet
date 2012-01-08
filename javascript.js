$(function(){

	// set URL using dynamic doc location and trigger a click
	var sBookmarklet = window.location = document.getElementById("aAddCss").href = "javascript:(function(){if(window.addCss!==undefined){window.addCss();}else{document.body.appendChild(document.createElement('script')).src='" + document.location.protocol + "//" + document.location.host + document.location.pathname + "addcss.js';}})();";

	// wait for it to load, then set some default CSS
	var timerWait = setInterval(function(){
		if (document.getElementById("txtAddCss")) {
			var $txt = $("#txtAddCss");
			if ($txt.val().trim() === "") {
				$txt.val("/* Edit me! */\n\nbody {\n\tbackground: #F5F5F5;\n\tcolor: #333;\n}").change();
			}
			clearInterval(timerWait);
		}
	}, 5);

	// fill textarea and setup ipad support toggler
	$("#txtCopy").html(sBookmarklet);
	var $dIpad = $("#dIpad")
	$("#aIpad").click(function(){
		document.title = "addCSS";
		$dIpad.toggle();
		return false;
	});

});