window.onload = function(){
	const name = document.getElementById("name");
	const painter = document.getElementById("painter");
	const oTime = document.getElementById("time");
	const lastTime = 20;
	const socket = io.connect('http://127.0.0.1:3000');
	const canvas = document.querySelector("#canvas");
	const cxt = canvas.getContext("2d");
	const canvasBox = canvas.getBoundingClientRect();

	function getName(){
		$.ajax({
			url:"/loginName",
			method:"get",
			success:function(data){
				if(data === ""){
					window.location.href = "/login.html";
				}
				name.innerText = data;
			}
		});
	}

	//画图
	function painting(){
		canvas.onmousedown = function(){
			canvas.addEventListener("mousemove",handler,true);
		}

		canvas.onmouseup = function(){
			canvas.removeEventListener("mousemove",handler,true);
		}

		socket.on("makeCanvas",function(msg){
			cxt.beginPath();
			cxt.arc(msg.X,msg.Y,5,0,Math.PI*2,true);
			cxt.fill();
		});
	}
	
	//画图调用函数
	function handler(e){
		cxt.beginPath();
		cxt.arc(e.pageX-canvasBox.left,e.pageY-canvasBox.top,5,0,Math.PI*2,true);
		cxt.fill();
		let msg = {"X":e.pageX-canvasBox.left,"Y":e.pageY-canvasBox.top};
		socket.emit("canvas",msg);
	}

	//聊天
	function chat(){
		const btn = document.getElementById("btn");
		const ipt = document.getElementById("ipt");
		const content = document.getElementById("content");
		btn.onclick = function(){
			socket.emit('question',name.innerText+"："+ipt.value);
			socket.on('answer',function(msg){
				let li = document.createElement("li");
				li.innerHTML = msg;
				content.appendChild(li);
				content.scrollTop = content.scrollHeight;
			});
		}  
	
		ipt.onkeypress = function(e){
			let event = e || window.event;   
		    if(event.keyCode == 13){   
		    	btn.click();   
		    }   
		}
	}

	//20秒倒计时
	const thisTime = new Date();
	const date = thisTime.getTime() + 20000;
	function time(){
		let timer = setInterval(function(){
			let now = new Date();
			let lastTime = Math.ceil((date - now.getTime())/1000);
			if(lastTime === 0){
				oTime.innerHTML = 0;
				clearInterval(timer);
			}
			else{
				oTime.innerHTML = lastTime;
			}
		},1000);
	}
	
	getName();
	painting();
	chat();	
	time();
}