class FPS{
    constructor(){
        this.width=150;
        this.height=65;

        this.canvas=document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.classList.add("fps_draw");
        this.canvas.width=this.width;
        this.canvas.height=this.height;
        document.body.appendChild(this.canvas);
        this.ctx.font="bold 16px Arial";
        var that=this;
        //метод, который ставит на паузу или возобновляет работу при нажатии на canvas
        this.canvas.addEventListener('click',function () {
            that.staypause();
        });

        this.hidden=true;
        this.startTime=0;
        this.frame=0;

        this.allFPS=[];
        this.playing=false;

        this.perf=(performance || Date);
    }
    //поставить на паузу
    staypause(){
        this.playing = this.playing ? false : true;
        if (this.playing) this.loop();
    }
    //вкл/выкл
    toggle(){
        this.hidden = this.hidden ? false : true;
        if(!this.hidden) {
            this.canvas.classList.add("is_visible");
            this.loop();
        }else{
            this.canvas.classList.remove("is_visible");
        }
    }
    loop() {
        if(this.hidden || !this.playing) return false;
        var that=this;
        window.requestAnimationFrame(function () {
            that.draw();
            that.loop();
        });
    }
    add(x){
        this.allFPS.unshift(x);
        //последние 150 значений FPS
        this.allFPS=this.allFPS.slice(0,this.width);
    }
    draw(){
        var currentFPS=this.getFPS();
        this.add(currentFPS);
        //очистить прямоугольник
        this.ctx.clearRect(0,0,this.width,this.height);
        //фоновый цвет
        this.ctx.fillStyle="#000000";
        //отрисовка fps
        for (var i=0; i<=this.width;i++) {
            this.ctx.fillRect(i, 0, 1,5+ 60-this.allFPS[i]);
        }
        this.ctx.fillText(currentFPS+" fps",22,52);//отрисовка тени для текста
        this.ctx.fillStyle="#ffffff";
        for (var i=0; i<=this.width;i++) {
            //отрисовка белой линии
            this.ctx.fillRect(i,5+60-this.allFPS[i],1,2);
        }
        //вывод fps текстом
        this.ctx.fillText(currentFPS+" fps",20,50);
    }
    getFPS(){
        this.frame++;
        var d=this.perf.now();
        this.currentTime = (d - this.startTime)/1000;
        var result = Math.floor(this.frame/this.currentTime);
        if(this.currentTime>1){
            this.startTime=this.perf.now();
            this.frame=0;
        }
        return result;
    }
}

var fps = new FPS;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "clicked_browser_action" ) {
            fps.toggle();
            fps.staypause();
        }
    }
);