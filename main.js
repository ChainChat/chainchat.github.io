window.addEventListener("load", function () {
	var cnv = document.getElementById("top-canvas");
	var ctx = cnv.getContext("2d");

	var Point = function (r, p, v) {
		var self = this;
		self.r = r;
		self.p = p;
		self.v = v;
		self.move = function (dt) {
			self.p[0] += self.v[0]*dt;
			self.p[1] += self.v[1]*dt;
		};
	};

	var points = [];

	var poisson = function (a) {
		var limit = Math.exp(-a);
		var prod = Math.random();
		var n;
		for (n = 0; prod >= limit; ++n) {
			prod *= Math.random();
		}
		return n;
	};

	var genPoint = function () {
		var a = Math.random(), b = Math.random();
		var wp = cnv.width/(cnv.height + cnv.width);
		var r = 20*Math.random() + 10;
		var p, d;
		if (a < wp) {
			if (a < 0.5*wp) {
				p = [b*cnv.width, -r];
				d = 0.5*Math.PI;
			} else {
				p = [b*cnv.width, cnv.height + r];
				d = 1.5*Math.PI;
			}
		} else {
			if (a > 0.5*(1 + wp)) {
				p = [-r, b*cnv.height];
				d = 0;
			} else {
				p = [cnv.width + r, b*cnv.height];
				d = Math.PI;
			}
		}
		var da = d + Math.PI*(Math.random() - 0.5);
		var s = 10 + 20*Math.random();
		var v = [s*Math.cos(da), s*Math.sin(da)];
		return new Point(r, p, v);
	};

	var genMultiplePoints = function (a) {
		var n = poisson(a);
		for (var i = 0; i < n; ++i) {
			points.push(genPoint());
		}
	};

	var move = function (dt) {
		var arr = [];
		for (var i = 0; i < points.length; ++i) {
			var p = points[i];
			p.move(dt);
			if (!(p.p[0] < -2*p.r || p.p[0] > cnv.width + 2*p.r || p.p[1] < -2*p.r || p.p[1] > cnv.height + 2*p.r)) {
				arr.push(p);
			}
		}
		points = arr;
		console.log(points.length);
	};

	var draw = function () {
		ctx.clearRect(0,0,cnv.width,cnv.height);

		ctx.fillStyle = "#FFFFFF";
		for (var i = 0; i < points.length; ++i) {
			var p = points[i];
			ctx.beginPath();
			ctx.arc(p.p[0],p.p[1],p.r,0,2*Math.PI);
			ctx.fill();
		}
	};

	var top = document.getElementById("top");
	var resize = function () {
		cnv.width = top.offsetWidth;
		cnv.height = top.offsetHeight;
		draw();
	};
	top.addEventListener("resize", resize);

	resize();

	ms = 50;
	var step = function () {
		genMultiplePoints(1e-3*ms);
		move(1e-3*ms);
		draw();
		setTimeout(step, ms);
	}
	
	step();
});