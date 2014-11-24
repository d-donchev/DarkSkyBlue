$( document ).ready(function() {
	$("#social").click(function () {
		$(".user-account-aside").css('display', 'none');
		$(".user-account-content").css('width', '100%');
		$(".my-media").css('visibility', 'visible');
		$(".user-account-content").html("<h2 class='social-heading'>Social Music network</h2>");
	});
	$(".my-media").click(function () {
		$(this).css('visibility', 'hidden');
		$(".user-account-content").css('width', '88%');
		$(".user-account-aside").fadeIn( 400 );
		$(".social-heading").remove();
	});
});