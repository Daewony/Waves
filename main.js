(function(){
    "use strict";

    // 웨이브 갯수, 색상, 움직임 설정, 위치, 저장공간, 애니메이션
    var cvs,ctx;
    var nodes = 4;
    var waves = [];
    var waveHeight = 100;
    var colours = ["#f80000", "#00f800", "#0000f8"];
    // var colours = ["#f80000", "#00f800"];
    // var colours = ["#00f800"];

    function init(){
        cvs = document.getElementById("canvas");
        ctx = cvs.getContext("2d");
        resizeCanvas(cvs);

        for(var i = 0; i< colours.length;i++){
            waves.push(new wave(colours[i],10,nodes,cvs.width));
        }
      
        update();
    }

    // 어떤걸, 어느 사이즈로?
    function resizeCanvas(canvas, width,height) {
        
        if(width && height) {
            canvas.width = width;
            canvas.height = height;
        }
        else {
            if(window.innerWidth > 1920) {
                canvas.width = window.innerWidth;
            } else {
                canvas.width = 1920;
            }

            canvas.height = waveHeight;
        }
    }
    // 파도: 색상, 파장, 그래프를 구성하는 점(node)의 개수
    function wave(colour, lambda,nodes,cvsWidth) {
    // function wave(colour, lambda,nodes) {
        this.colour = colour;
        this.lambda = lambda;
        this.cvsWidth = cvsWidth;
        this.nodes = intializeNodes(nodes, cvsWidth);
        // this.nodes = [];

        var tick = 1;

        // x좌표, y좌표, 속도 초기화 => 함수로 만들고싶은(의미파악 가독성을 위함)
        // for (var i = 0;i<= nodes + 2; i++){
        //     var temp = [(i - 1) * cvs.width / nodes, 0, Math.random() * 200, .3];
        //     this.nodes.push(temp);
        //     // console.log(temp);
        // }
        // console.log(this.nodes);
    }

    function intializeNodes(nodes,cvsWidth) {
        const initializedNodes = [];
        for (var i = 0; i <= nodes + 2; i++) {
            var temp = [(i - 1) * cvsWidth / nodes, 0, Math.random() * 200, .3];
            initializedNodes.push(temp);
            // console.log(temp);
        }
        return initializedNodes;
    }

    function update() {
        // var fill = window.getComputedStyle(document.querySelector(".header"),null).getPropertyPriority("background-color"); => 메서드 이름 잘 보자
        var fill = window.getComputedStyle(document.querySelector(".header"), null).getPropertyValue("background-color");
        
        // console.log(fill); // 아무것도 없는건가?
        // console.log(ctx);
        ctx.fillStyle = fill;
        ctx.globalCompositeOperation = "source-over";
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        ctx.globalCompositeOperation = "screen";
        // ctx.globalCompositeOperation은 캔버스에 그려진 그래픽 요소들의 합성 방법을 설정하는 속성
        console.log(ctx.globalCompositeOperation);
        for (var i = 0; i < waves.length; i++) {
            for (var j = 0; j < waves[i].nodes.length; j++) {
                bounce(waves[i].nodes[j]);
                // console.log(waves[i].nodes[j]);
            }
            drawWave(waves[i]);
        }
        ctx.fillStyle = fill;

        requestAnimationFrame(update);
    }

    function bounce(nodeArr) {
        nodeArr[1] = waveHeight / 2 * Math.sin(nodeArr[2] / 13) + cvs.height / 2;
        nodeArr[2] = nodeArr[2] + nodeArr[3];

    }

    function drawWave(obj) {
        var diff = function (a, b) {
            return (a+b) / 2 ;
        }

        ctx.fillStyle = obj.colour;
        // console.log(ctx.fillStyle);
        ctx.beginPath();
        ctx.moveTo(0, cvs.height);
        ctx.lineTo(obj.nodes[0][0], obj.nodes[0][1]);
        // ctx.lineTo(obj.nodes[0][1],obj.nodes[0][0] );

        // 파형 객체의 노드들을 순회하면서 그래프를 그립니다.
        for (var i = 0; i < obj.nodes.length; i++) {
            // console.log(obj.nodes.length);
            // 만약 현재 노드 다음에 노드가 있다면
            if (obj.nodes[i + 1]) {
                ctx.quadraticCurveTo(
                    obj.nodes[i][0], obj.nodes[i][1],
                    diff(obj.nodes[i][0], obj.nodes[i + 1][0]), 
                    diff(obj.nodes[i][1], obj.nodes[i + 1][1])
                );
                // console.log( obj.nodes[i][0], obj.nodes[i][1],
                //     diff(obj.nodes[i][0], obj.nodes[i + 1][0]), 
                //     diff(obj.nodes[i][1], obj.nodes[i + 1][1]));
            }
            else {
                ctx.lineTo(obj.nodes[i][0], obj.nodes[i][1]);
                ctx.lineTo(cvs.width, cvs.height);
            }
        }
        ctx.closePath();
        ctx.fill();
    }

    // init();
    document.addEventListener("DOMContentLoaded", init, false);
})();