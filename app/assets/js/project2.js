// module that uses a safe reference to library alias
(function($) {
	console.log(6+6);

	$(document).ready(function(){


		$(function(){
			if(window.location.href.indexOf("give") > -1) {
			       //alert("Alert: Desktop!");
			       $('.give').addClass('active');
			}
		});

	});
})(ISP.jQuery);