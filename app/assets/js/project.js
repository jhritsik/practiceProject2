// per-project JS here

(function($) {
	console.log(5+6);
	function supportsTemplate() {
	  return 'content' in document.createElement('template');
	}

	if (supportsTemplate()) {
	  // Good to go!
	} else {
	  // Use old templating techniques or libraries.
	}
	$(document).ready(function(){




	});
})(ISP.jQuery);
