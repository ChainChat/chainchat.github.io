window.addEventListener("load", function () {
	var cnv = document.getElementById("top-canvas");
	var ctx = cnv.getContext("2d");

	var draw = function () {
		ctx.fillStyle = "#FFFFFF";
		ctx.beginPath();
		ctx.arc(100,100,50,0,2*Math.PI);
		ctx.fill();
	}

	var top = document.getElementById("top");
	var resize = function () {
		cnv.width = top.offsetWidth;
		cnv.height = top.offsetHeight;
		draw();
	};
	top.addEventListener("resize", resize);

	resize();
});