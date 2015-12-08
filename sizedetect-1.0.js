/*

    Size Detect
    - The link between JS and CSS media queries

    (Mainly intended to work with bootstrap, but can be easyly customized)



Setup:
 
	1.) Add the following CSS (change the pixel values if needed):
	 
	html {font-family: 'xs'}
	@media (min-width: 768px)  { html {font-family: 'sm' }}
	@media (min-width: 992px)  { html {font-family: 'md' }}
	@media (min-width: 1200px) { html {font-family: 'lg' }}


	2.) Load jQuery and then Size Detect (jQuery is only needed for onload)

	<script type="text/javascript" src="sdetect.js"></script>


	3.) Add the following JS

	var detector;

	$(function (){
		detector = new SizeDetect();

		detector.bind(function (size){
			console.log(size); // Do stuff here
		})

		detector.trigger(); 
	})



Customizing:

	If you need more breaking points, horizontal media queris etc.. bla bla
	bla bla bla bla bla bla

	var detector_custom;

	$(function (){
		detector_custom = new SizeDetect({
			detector: function (){
				console.log('your custom detector');
			}
		})
	})


	Bla bla bla - bla bla bla bla bla bla bla bla blab alba lba lbal bal b
	bla bla bla bla bla blaba lbal

	$(window).resize(function (){
		console.log(detector.getSize());
	});

*/


function SizeDetect(options){
	this.triggers=[];
	this.size=null;
	this.options={};
	this.defaults={
		detector: function (){
			var elem1 = document.getElementsByTagName("html")[0];

			if(typeof window.getComputedStyle === 'function'){
				deviceSize = window.getComputedStyle(elem1, null).fontFamily;
			}else if(typeof elem1.currentStyle === 'object'){
				deviceSize = elem1.currentStyle.fontFamily;
			} else {
				deviceSize = false;
			}
			var size = false;
			if (deviceSize.indexOf("lg") !=-1){
				size = 'lg';
			} else if (deviceSize.indexOf("md") !=-1){
				size = 'md';
			} else if (deviceSize.indexOf("sm") !=-1){
				size = 'sm';
			} else if (deviceSize.indexOf("xs") !=-1){
				size = 'xs';
			}

			return size;
		},
		sizes: [false,'xs','sm','md','lg']
	};

	this.__init(options);
}
SizeDetect.prototype.__init = function(options) {
	var parent=this;
	this.options=this.defaults;
	for(var option in options){
		this.options[option]=options[option];
	}

	if (window.addEventListener) {
		window.addEventListener('resize', function (e){
			parent.__detect(e);
		}, false); 
	} else if (window.attachEvent)  {
		window.attachEvent('onresize', function (e){
			parent.__detect(e);
		});
	}

	this.__detect();
};
SizeDetect.prototype.__detect = function(e) {
	if(this.getSize()!==this.defaults.detector()){
		this.size=this.defaults.detector();
		this.trigger();
	}
};
SizeDetect.prototype.getSize = function() {
	return this.size;
};
SizeDetect.prototype.bind = function(action) {
	this.triggers.push(action);
};
SizeDetect.prototype.trigger = function(){
	for(var trigg in this.triggers){
		this.triggers[trigg](this.size);
	}
};
SizeDetect.prototype.isBigger = function(compareWith) {
	return (this.options.sizes.indexOf(compareWith))<(this.options.sizes.indexOf(this.getSize()));
};
SizeDetect.prototype.isSmaller = function(compareWith) {
	return (this.options.sizes.indexOf(compareWith))>(this.options.sizes.indexOf(this.getSize()));
};
SizeDetect.prototype.isEqual = function(compareWith) {
	return (this.options.sizes.indexOf(compareWith))==(this.options.sizes.indexOf(this.getSize()));
};