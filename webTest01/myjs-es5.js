"use strict";

window.onload = function () {
	var name = document.getElementById("name");
	var painter = document.getElementById("painter");
	var oTime = document.getElementById("time");
	var lastTime = 20;
	var socket = io.connect('http://127.0.0.1:3000');
	var canvas = document.querySelector("#canvas");
	var cxt = canvas.getContext("2d");
	var canvasBox = canvas.getBoundingClientRect();

	function getName() {
		$.ajax({
			url: "/loginName",
			method: "get",
			success: function success(data) {
				if (data === "") {
					window.location.href = "/login.html";
				}
				name.innerText = data;
			}
		});
	}

	//画图主函数
	function painting() {
		canvas.onmousedown = function () {
			canvas.addEventListener("mousemove", handler, true);
		};

		canvas.onmouseup = function () {
			canvas.removeEventListener("mousemove", handler, true);
		};

		socket.on("makeCanvas", function (msg) {
			cxt.beginPath();
			cxt.arc(msg.X, msg.Y, 5, 0, Math.PI * 2, true);
			cxt.fill();
		});
	}

	//画图调用函数
	function handler(e) {
		cxt.beginPath();
		cxt.arc(e.pageX - canvasBox.left, e.pageY - canvasBox.top, 5, 0, Math.PI * 2, true);
		cxt.fill();
		var msg = { "X": e.pageX - canvasBox.left, "Y": e.pageY - canvasBox.top };
		socket.emit("canvas", msg);
	}

	//聊天
	function chat() {
		var btn = document.getElementById("btn");
		var ipt = document.getElementById("ipt");
		var content = document.getElementById("content");
		btn.onclick = function () {
			socket.emit('question', name.innerText + "：" + ipt.value);
			socket.on('answer', function (msg) {
				var li = document.createElement("li");
				li.innerHTML = msg;
				content.appendChild(li);
				content.scrollTop = content.scrollHeight;
			});
		};

		ipt.onkeypress = function (e) {
			var event = e || window.event;
			if (event.keyCode == 13) {
				btn.click();
			}
		};
	}

	//20秒倒计时
	var thisTime = new Date();
	var date = thisTime.getTime() + 20000;
	function time() {
		var timer = setInterval(function () {
			var now = new Date();
			var lastTime = Math.ceil((date - now.getTime()) / 1000);
			if (lastTime === 0) {
				oTime.innerHTML = 0;
				clearInterval(timer);
			} else {
				oTime.innerHTML = lastTime;
			}
		}, 1000);
	}

	getName();
	painting();
	chat();
	time();
};
