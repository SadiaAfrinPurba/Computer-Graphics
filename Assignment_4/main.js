    /*********************************************
                      INITIAL SETUP
    **********************************************/

   var canvas = document.getElementById('canvas');
   gl = canvas.getContext('experimental-webgl');

   gl.viewport(0, 0, canvas.width, canvas.height);
   gl.clearColor(0.5, 0.5, 0.5, 1);
   gl.enable(gl.DEPTH_TEST);
   gl.clear(gl.COLOR_BUFFER_BIT);

   gl.enable(gl.CULL_FACE);
   gl.frontFace(gl.CCW);
   gl.cullFace(gl.BACK);

   /*********************************************
            CREATE SHADER PROGRAMS
   **********************************************/


   /**********Vertex Shader**********************/
   var vertCode =
       'precision mediump float;'+
       'attribute vec3 position;'+
       'attribute vec3 color;'+
       'varying vec3 v_color;'+
       'uniform mat4 u_model;'+
       'uniform mat4 u_view;'+
       'uniform mat4 u_projection;'+
       'void main(void) {'+  
           'v_color = color;'+    
           'gl_Position = u_projection * u_model * u_view *  vec4(position,1.0);'+
           
       '}';

   var vertShader = gl.createShader(gl.VERTEX_SHADER);
   gl.shaderSource(vertShader, vertCode);
   gl.compileShader(vertShader);

   /**********Fragment Shader**********************/
   var fragCode =
       'precision mediump float;'+
       'varying vec3 v_color;'+
       'void main(void) { '+
       'gl_FragColor = vec4(v_color, 1.0);'+
   
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
            CUBE VERTICES
   **********************************************/
   var r = () => Math.random();
   var cubeVertices = 
       [ // X, Y, Z           R, G, B
           // Top
            -1.0, 1.0, -1.0,   0.5, 0.5, 0,
            -1.0, 1.0, 1.0,    0.5, 0.5, 0,
            1.0, 1.0, 1.0,     0.5, 0.5, 0,
            1.0, 1.0, -1.0,    0.5, 0.5, 0,

           // Left
           -1.0, 1.0, 1.0,    0.75, 0, 0.5,
           -1.0, -1.0, 1.0,   0.75, 0, 0.5,
           -1.0, -1.0, -1.0,  0.75, 0, 0.5,
           -1.0, 1.0, -1.0,   0.75, 0, 0.5,

           // Right
           1.0, 1.0, 1.0,    0.0, 0.25, 0.75,
           1.0, -1.0, 1.0,   0.0, 0.25, 0.75,
           1.0, -1.0, -1.0,  0.0, 0.25, 0.75,
           1.0, 1.0, -1.0,   0.0, 0.25, 0.75,

           // Front
           1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
           1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
           -1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
           -1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

           // Back
           1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
           1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
           -1.0, -1.0, -1.0,   0.0, 1.0, 0.15,
           -1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

           // Bottom
           -1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
           -1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
           1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
           1.0, -1.0, -1.0,    0.5, 0.5, 1.0,

           -1, 1,-1,  0.0, 0.5, 1.0,
           -1, 1, 1, 0.0, 0.5, 1.0,
           1, 1, 1,  0.0, 0.5, 1.0,
           1, 1,-1,  0.0, 0.5, 1.0,
       ];

   var cubeIndices =
       [
           // Top
           0, 1, 2,
           0, 2, 3,

           // Left
           5, 4, 6,
           6, 4, 7,

           // Right
           8, 9, 10,
           8, 10, 11,

           // Front
           13, 12, 14,
           15, 14, 12,

           // Back
           16, 17, 18,
           16, 18, 19,

           // Bottom
           21, 20, 22,
           22, 20, 23
       ];


   /*********************************************
           ORTHOGRAPHIC PROJECTION
   **********************************************/

   function setUniformVariable(shaderProgramVariable,value){
       var uniformLocation = gl.getUniformLocation(shaderProgram, shaderProgramVariable);
       gl.uniformMatrix4fv(uniformLocation, false, value);
   }
   var mModel = new Float32Array(16);
   var mView = new Float32Array(16);
   var mProjection = new Float32Array(16);
   glMatrix.mat4.identity(mView);
   glMatrix.mat4.identity(mModel);
   
   //lookAt(out, eye, center, up) → {mat4} [for view]
   var ex=1,ey=1,ez=1;
   glMatrix.mat4.lookAt(mView, [ex, ey, ez], [0, 0, 0], [0, 1, 0]);

   //ortho(out, left, right, botton, top) → {mat4} [for projection]
   glMatrix.mat4.ortho(mProjection,-3,3,-3,3,.001,100.0);

   
   setUniformVariable('u_view',mView);
   setUniformVariable('u_projection',mProjection);


   
   /*********************************************
            BINDING VERTICES WITH SHADERS
   **********************************************/


   var vertexBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices),gl.STATIC_DRAW);
   
   var cubeIndexBufferObject = gl.createBuffer();
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBufferObject);
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

   var position = gl.getAttribLocation(shaderProgram, 'position');
   gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
   //gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);

   gl.enableVertexAttribArray(position);

   var color = gl.getAttribLocation(shaderProgram, 'color');
   gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
   //gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0,0);

   gl.enableVertexAttribArray(color);
   

   /*********************************************
            DRAW CUBE
   **********************************************/

    var xRotationMatrix = new Float32Array(16);
    var identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    
    //rotate 15 degree
    var angle = (15 * Math.PI) / 180;
    var mRotate = glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle, [1, 0, 0]);
    
    //mul(out, matrix1, matrix2) → {mat4}
    glMatrix.mat4.mul(mModel, mModel, mRotate);
    setUniformVariable('u_model',mModel);
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);


   /*********************************************
            KEYBOARD EVENTS
   **********************************************/
   window.addEventListener("keydown", keyEvent, false);

   function keyEvent(ev){
        ex = -1;
        ey = -1;
        ez = 1;
        glMatrix.mat4.lookAt(mView, [ex, ey, ez], [0, 0, 0], [0, 1, 0]);
        setUniformVariable('u_view',mView);
        
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
   }


