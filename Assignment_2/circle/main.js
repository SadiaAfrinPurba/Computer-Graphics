var canvas = document.getElementById('canvas');
gl = canvas.getContext('experimental-webgl');

function stars(){
    let points = [];
    for (let i = 0; i < canvas.width; i++) {
        const x = () => Math.random() - .9;
        const y = () => Math.random() + .5;
        const z = () => Math.random() + .2;
        points.push(x(),y(),z());
        
    }
    // for (let i=0.0; i<=360; i+=1) {
    //     // degrees to radians
    //     var j = i * Math.PI / 180;
       
    //     points.push( Math.sin(j),Math.cos(j),0);
    // }
    console.log(points);
    return points;
  
}



// const starCount = 1000;
var stars_vertices = [];
stars_vertices = stars();
var star_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, star_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(stars_vertices), gl.STATIC_DRAW);

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
gl.viewport(0,0,canvas.width,canvas.height);
gl.drawArrays(gl.POINTS, 0, starCount);