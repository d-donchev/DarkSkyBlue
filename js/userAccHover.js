$( document ).ready(function() {
	$(".user-panel-box").mouseenter(function () {
		$(this).css({'background':'#77C4A2','cursor':'pointer'});
	});
	$(".user-panel-box").mouseleave(function () {
		$(this).css('background', '');
	});
});