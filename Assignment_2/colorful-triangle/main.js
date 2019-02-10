  /*================Creating a canvas=================*/
  var canvas = document.getElementById('canvas');
  gl = canvas.getContext('experimental-webgl'); 

  /*==========Defining and storing the geometry=======*/


   var vertices = [
      -0.5,0.5,0.0,
      -0.5,-0.5,0.0,
      0.5,-0.5,0.0, 
   ];
   var colorData = [
      1,0,0,
      0,1,0,
      0,0,1,
     
   ];
   console.log(vertices);

  // Create an empty buffer object to store the vertex buffer
  var vertex_buffer = gl.createBuffer();

  //Bind appropriate array buffer to it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

  // Pass the vertex data to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


   var color_buffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
  
   // Unbind the buffer
//   gl.bindBuffer(gl.ARRAY_BUFFER, null);

  /*=========================Shaders========================*/

  // color shader source code
  //varying means sending data from vertex shader to fragment shader
  var vertCode =
     'attribute vec3 coordinates;'+
     'attribute vec3 color;'+
      'varying vec3 vColor;'+
      'precision mediump float;'+
      'void main(void) {'+
         'vColor = color;'+
         'gl_Position = vec4(coordinates, 1.0);'+
        'gl_PointSize = 10.0;'+
     '}';
    console.log(vertCode);
  // Create a vertex shader object
  var vertShader = gl.createShader(gl.VERTEX_SHADER);
  
  // Attach vertex shader source code
  gl.shaderSource(vertShader, vertCode);

  // Compile the vertex shader
  gl.compileShader(vertShader);

  // fragment shader source code
  var fragCode =
    
     'precision mediump float;'+
      'varying vec3 vColor;'+
      'uniform vec3 fColor;'+
      'void main(void) { '+
         'gl_FragColor = vec4(vColor * fColor,1);'+
     '}';

  // Create fragment shader object
  var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

  // Attach fragment shader source code
  gl.shaderSource(fragShader, fragCode);

  // Compile the fragment shader
  gl.compileShader(fragShader);
  
  // Create a shader program object to store
  // the combined shader program
  var shaderProgram = gl.createProgram();

  // Attach a vertex shader
  gl.attachShader(shaderProgram, vertShader); 

  // Attach a fragment shader
  gl.attachShader(shaderProgram, fragShader);

  // Link both programs
  gl.linkProgram(shaderProgram);

  // Use the combined shader program object
  gl.useProgram(shaderProgram);

  /*======== Associating shaders to buffer objects ========*/

  // Bind vertex buffer object
 

  // Get the attribute location
  var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    // Enable the attribute
   gl.enableVertexAttribArray(coord);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  // Point an attribute to the currently bound VBO
  gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);


   //color data binding
  
   var color = gl.getAttribLocation(shaderProgram, "color");
   gl.enableVertexAttribArray(color);
   gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
   gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
   
   var fColorLocation = gl.getUniformLocation(shaderProgram, "fColor");

    canvas.onmousedown = function (ev) { click(ev, gl, canvas, fColorLocation); };

    function click(ev, gl, canvas, fColorLocation)
{
        var r = ()=>Math.random();
        gl.uniform3f(fColorLocation,r(),r(),r());
        gl.clearColor(0.2, 0.2, 0.2, 1);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
}

  /*============= Drawing the primitive ===============*/

  // Clear the canvas
//   gl.clearColor(0, 0, 0, 1);
  gl.clearColor(0.2, 0.2, 0.2, 1);
  // Enable the depth test
  gl.enable(gl.DEPTH_TEST);

  // Clear the color buffer bit
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set the view port
   gl.viewport(0,0,canvas.width,canvas.height);

  // Draw the triangle
  gl.drawArrays(gl.TRIANGLES, 0, 3);