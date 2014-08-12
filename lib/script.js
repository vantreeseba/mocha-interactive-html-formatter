$(document).on('ready', function() {
    $('.suite').on('click', function(e) {
		var el = $(this);
        el.children().toggle();
		el.toggleClass('open');
		el.toggleClass('closed');
        e.stopImmediatePropagation();
    });
});
