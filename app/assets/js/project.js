// per-project JS here

(function($) {
	console.log(5+6);

	$(document).ready(function(){

		$('#ca-container').contentcarousel();

		$(function(){
			if (window.location.href.indexOf("?index") > -1) {
			    alert("found it");
			}
			
		    /*var current = location.pathname;
		    $('.navigation li a').each(function(){
		        var $this = $(this);
		        // if the current path is like this link, make it active
		        if($this.attr('href').indexOf(current) !== -1){
		            $this.addClass('active');
		        };
		    });*/
		});

	});
})(ISP.jQuery);
