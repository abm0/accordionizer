$(window).ready(function(){
	$('.main-banner').accordionize();

	carouFredSelInit();
});

function carouFredSelInit() {
	$('#offers-widget .widget-content').caroufredsel({
		circular: true,
		infinite: true,
		scroll: {
			items: 1,
			fx: 'crossfade',
			duration: 1000
		}
	});
}