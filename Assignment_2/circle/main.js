var canvas = document.getElementById('canvas');
gl = canvas.getContext('experimental-webgl');
const starCount = 3000;
var points = new Float32Array(starCount);
// var circle_point = new Float32Array(starCount);
gl.canvas.width  = gl.canvas.clientWidth  * window.devicePixelRatio;
gl.canvas.height = gl.canvas.clientHeight * window.devicePixelRatio;
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0, 0, 0, 1);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT);

//STARS
function randInt(max) {
    return Math.random() * max | 0;
}
function stars(starCount){


    for (var i = 0; i < starCount; i += 0.5) {
        var x = randInt(gl.canvas.width);
        var y = randInt(gl.canvas.height);
    
        points[i + 0] = (x + 0.5) / gl.canvas.width  * 2 - 1;
        points[i + 1] = (y + 0.5) / gl.canvas.height * 2 - 1;
      }
     console.log(points);
     return points;

  
}
//CIRCLE
function radian (degree) {
    var rad = degree * (Math.PI / 180);
    return rad;
 }

function circle(){
    
    var vertices = [];
    
    var vert1 = [];
  
    for (let i=0; i<=360; i+=1) {

      
        vert1.push(Math.sin(radian(i)),Math.cos(radian(i)));

    //     var j = i * Math.PI / 180;
         
    //     // circle_point.push( Math.sin(j),Math.cos(j),0);
    //       // X Y Z
    // var vert1 = [
    //     Math.sin(j),
    //     Math.cos(j),
    //     // 0,
    //   ];
      var vert2 = [
        0,
        0,
        // 0,
      ];
      vertices = vertices.concat(vert1);
      vertices = vertices.concat(vert2);
    }
    // return vertices;
    return vertices;
}


var vertCode =
      'attribute vec3 position;'+
      'precision mediump float;'+
      'void main(void) {'+
         // 'vColor = color;'+
         'gl_Position = vec4(position, 1);'+
        'gl_PointSize = 1.5;'+
     '}';

var vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);

var fragCode =
    'precision mediump float;'+
 
 'void main(void) { '+
    'gl_FragColor = vec4(1,1,1,1);'+
'}';
var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, fragCode);
gl.compileShader(fragShader);

var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertShader); 
gl.attachShader(shaderProgram, fragShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);


function drawElement(type,vertices,dim,len) {
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    var position = gl.getAttribLocation(shaderProgram, 'position');
    gl.vertexAttribPointer(position, dim, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);

    gl.drawArrays(type, 0, len);
}


//DRAWING STARS
var starVertices = stars(starCount);
var len = starCount/3;
drawElement(gl.POINTS,starVertices,3,len);

//DRAWING CIRCLE

drawElement(gl.LINES,new Float32Array(circle()),2,65702);
