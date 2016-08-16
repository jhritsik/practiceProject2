// module that uses a safe reference to library alias
(function($) {
	console.log(6+6);

	$(document).ready(function(){


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