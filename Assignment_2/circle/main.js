/*********************************************
         INITIAL SETUP
**********************************************/

var canvas = document.getElementById('canvas');
gl = canvas.getContext('experimental-webgl');

// make canvas 1x1 with display
gl.canvas.width  = gl.canvas.clientWidth  * window.devicePixelRatio;
gl.canvas.height = gl.canvas.clientHeight * window.devicePixelRatio;
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0, 0, 0, 1);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT);

/*********************************************
         STARS VERTICES
**********************************************/
const starCount = 9000;
var points = new Float32Array(starCount);

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

/*********************************************
         CIRCLE VERTICES
**********************************************/

function radian (degree) {
    var rad = degree * (Math.PI / 180);
    return rad;
 }

function circle(){
    
    var vertices = [];
    var vert1 = [];
    var vert2 = [];
  
    for (let i=0; i<=360; i+=1) {
         
        vert1.push(Math.sin(radian(i)),Math.cos(radian(i)));
        var vert2 = [
        0,
        0,
      ];
      vertices = vertices.concat(vert1);
      vertices = vertices.concat(vert2);
    }
    
    return vertices;
}

/*********************************************
         CREATE SHADER PROGRAMS
**********************************************/


/**********Vertex Shader**********************/
var vertCode =
      'attribute vec3 position;'+
      'precision mediump float;'+
      'void main(void) {'+
         // 'vColor = color;'+
         'gl_Position = vec4(position, 1.1);'+
        'gl_PointSize = 1.99;'+
     '}';

var vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);

/**********Fragment Shader**********************/
var fragCode =
    'precision mediump float;'+
    'uniform vec4 fColor;'+
     'void main(void) { '+
    'gl_FragColor = fColor;'+
   
'}';
var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, fragCode);
gl.compileShader(fragShader);

var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertShader); 
gl.attachShader(shaderProgram, fragShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);


/*********************************************
         BINDING VERTICES WITH SHADERS
**********************************************/

function drawElement(type,vertices,dim,len) {
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    var position = gl.getAttribLocation(shaderProgram, 'position');
    gl.vertexAttribPointer(position, dim, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);

    var fColorLocation = gl.getUniformLocation(shaderProgram, "fColor");

    canvas.onmousedown = function (ev) { click(ev, gl, canvas, fColorLocation); };

    gl.drawArrays(type, 0, len);
}

/*********************************************
         DRAW STARS AND CIRCLE
**********************************************/

function draw(circle_point){

    //STARS
    var starVertices = stars(starCount);
    var len = starCount/3;
    drawElement(gl.POINTS,starVertices,3,len);

    //DRAWING CIRCLE
    drawElement(gl.LINES,new Float32Array(circle()),2,circle_point);


}
draw(65702);

/*********************************************
     RANDOMLY COLOR CHANGE ON MOUSE CLICK
**********************************************/

function click(ev, gl, canvas, fColorLocation)
{
        var r = Math.random();
        var g = Math.random();
        var b = Math.random();
        var a = 1.0;

        gl.uniform4f(fColorLocation,r,g,b, a);
        console.log(fColorLocation);
        gl.clearColor(0.2, 0.2, 0.2, 1);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
        draw(randInt(65702));
}



