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

	var 
		R0 = 2, R1 = 8,
		S0 = 10, S1 = 40,
		L0 = 100, L1 = 200;

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
		var w = cnv.width + 2*L1, h = cnv.height + 2*L1;
		var wp = w/(h + w);
		var r = (R1 - R0)*Math.random() + R0;
		var p, d;
		if (a < wp) {
			if (a < 0.5*wp) {
				p = [b*w - L1, -L1];
				d = 0.5*Math.PI;
			} else {
				p = [b*w - L1, h - L1];
				d = 1.5*Math.PI;
			}
		} else {
			if (a > 0.5*(1 + wp)) {
				p = [-L1, b*h - L1];
				d = 0;
			} else {
				p = [w - L1, b*h - L1];
				d = Math.PI;
			}
		}
		var da = d + Math.PI*(Math.random() - 0.5);
		var s = S0 + (S1 - S0)*Math.random();
		var v = [s*Math.cos(da), s*Math.sin(da)];
		return new Point(r, p, v);
	};

	var genMultiplePoints = function (a) {
		var nn = poisson(a);
		for (var i = 0; i < nn; ++i) {
			points.push(genPoint());
		}
	};

	var move = function (dt) {
		var arr = [];
		var delta = 0.1;
		var w = cnv.width + 2*L1, h = cnv.height + 2*L1;
		for (var i = 0; i < points.length; ++i) {
			var p = points[i];
			p.move(dt);
			if (!(p.p[0] < -L1 - delta || p.p[0] > w - L1 + delta || p.p[1] < -L1 - delta || p.p[1] > h - L1 + delta)) {
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

		for (var i = 0; i < points.length; ++i) {
			for (var j = 0; j < i; ++j) {
				var p0 = points[i];
				var p1 = points[j];
				var d = [p0.p[0] - p1.p[0], p0.p[1] - p1.p[1]];
				var l = Math.sqrt(d[0]*d[0] + d[1]*d[1]);
				if (l < L1) {
					ctx.lineWidth = 2;
					if (l < L0) {
						ctx.strokeStyle = "#FFFFFF";
					} else {
						ctx.strokeStyle = "rgba(255,255,255," + (L1 - l)/(L1 - L0) + ")";
					}
					ctx.beginPath();
					ctx.moveTo(p0.p[0], p0.p[1]);
					ctx.lineTo(p1.p[0], p1.p[1]);
					ctx.stroke();
				}
			}
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
	var step = function (dt) {
		genMultiplePoints((cnv.width + cnv.height + 4*L1)*2e-3*dt);
		move(dt);
		draw();
		setTimeout(function () { step(1e-3*ms); }, ms);
	}
	
	step(2*(Math.min(cnv.width, cnv.height) + 2*L1)/(S0 + S1));
});