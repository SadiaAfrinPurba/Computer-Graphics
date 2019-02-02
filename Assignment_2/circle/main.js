var canvas = document.getElementById('canvas');
gl = canvas.getContext('experimental-webgl');



const starCount = 1000;
var points = new Float32Array(starCount);
gl.canvas.width  = gl.canvas.clientWidth  * window.devicePixelRatio;
gl.canvas.height = gl.canvas.clientHeight * window.devicePixelRatio;
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


//STARS
function randInt(max) {
    return Math.random() * max | 0;
}
function stars(starCount){
  
    // for (let i=0.0; i<=360; i+=1) {

    //     var j = i * Math.PI / 180;
       
    //     points.push( Math.sin(j),Math.cos(j),0);
    // }

    for (var i = 0; i < starCount; i += 0.5) {
        var x = randInt(gl.canvas.width);
        var y = randInt(gl.canvas.height);
    
        points[i + 0] = (x + 0.5) / gl.canvas.width  * 2 - 1;
        points[i + 1] = (y + 0.5) / gl.canvas.height * 2 - 1;
      }
     console.log(points);


  
}
stars(starCount);

var star_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, star_buffer);
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

//CIRCLE



var vertCode =
      'attribute vec3 stars_coord;'+
      'precision mediump float;'+
      'void main(void) {'+
         // 'vColor = color;'+
         'gl_Position = vec4(stars_coord, 1.0);'+
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

var stars_coord = gl.getAttribLocation(shaderProgram, "stars_coord");
gl.enableVertexAttribArray(stars_coord);
gl.bindBuffer(gl.ARRAY_BUFFER, star_buffer);
gl.vertexAttribPointer(stars_coord, 3, gl.FLOAT, false, 0, 0);



gl.clearColor(0, 0, 0, 1);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT);
// gl.viewport(0,0,canvas.width,canvas.height);



gl.drawArrays(gl.POINTS, 0, 333);
// var then = 0;
 
// requestAnimationFrame();


