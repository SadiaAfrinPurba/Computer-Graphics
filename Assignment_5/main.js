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
       'attribute vec2 textureCoord;'+
       'varying  highp vec2 v_texture;'+
       'uniform mat4 u_model;'+
       'uniform mat4 u_view;'+
       'uniform mat4 u_projection;'+
       'void main(void) {'+  
        
           'gl_Position = u_projection * u_model * u_view *  vec4(position,1.0);'+
           'v_texture = textureCoord;'+ 
       '}';

   var vertShader = gl.createShader(gl.VERTEX_SHADER);
   gl.shaderSource(vertShader, vertCode);
   gl.compileShader(vertShader);

   /**********Fragment Shader**********************/
   var fragCode =
       'precision mediump float;'+
       'varying  highp vec2 v_texture;'+
       'uniform sampler2D uSampler;'+
       'void main(void) { '+
       'gl_FragColor = texture2D(uSampler, v_texture);'+
       //' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);' +
   
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

  var cubeVertices = 
      [ // Top
		-1.0, 1.0, -1.0,   0, 0,
		-1.0, 1.0, 1.0,    0, 1,
		1.0, 1.0, 1.0,     1, 1,
		1.0, 1.0, -1.0,    1, 0,

		// Left
		-1.0, 1.0, 1.0,    0, 0,
		-1.0, -1.0, 1.0,   1, 0,
		-1.0, -1.0, -1.0,  1, 1,
		-1.0, 1.0, -1.0,   0, 1,

		// Right
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,   0, 1,
		1.0, -1.0, -1.0,  0, 0,
		1.0, 1.0, -1.0,   1, 0,

		// Front
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,    1, 0,
		-1.0, -1.0, 1.0,    0, 0,
		-1.0, 1.0, 1.0,    0, 1,

		// Back
		1.0, 1.0, -1.0,    0, 0,
		1.0, -1.0, -1.0,    0, 1,
		-1.0, -1.0, -1.0,    1, 1,
		-1.0, 1.0, -1.0,    1, 0,

		// Bottom
		-1.0, -1.0, -1.0,   1, 1,
		-1.0, -1.0, 1.0,    1, 0,
		1.0, -1.0, 1.0,     0, 0,
		1.0, -1.0, -1.0,    0, 1
      ];

        var cubeIndices =
            [	// Top
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
        gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.enableVertexAttribArray(position);

        var textureAtt = gl.getAttribLocation(shaderProgram, 'textureCoord');
        gl.vertexAttribPointer(textureAtt, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(textureAtt);
        
        /*********************************************
                        TEXTURE
        **********************************************/
       var texture = gl.createTexture();
       gl.bindTexture(gl.TEXTURE_2D, texture);
       var level = 0;
       var internalFormat = gl.RGBA;
       var srcFormat = gl.RGBA;
       var srcType = gl.UNSIGNED_BYTE;
    
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.bindTexture(gl.TEXTURE_2D, texture);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                srcFormat, srcType, document.getElementById('image'));
            // Tell WebGL we want to affect texture unit 0
            gl.activeTexture(gl.TEXTURE0);

            // Bind the texture to texture unit 0;
            
        

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
        gl.activeTexture(gl.TEXTURE0);
        gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);


        /*********************************************
                 KEYBOARD EVENTS
        **********************************************/
        window.addEventListener("keydown", keyEvent, false);

        function keyEvent(ev){
            
            if(event.keyCode == 38){
                glMatrix.mat4.ortho(mProjection,-1,1,-1,1,.001,100.0);
                setUniformVariable('u_projection',mProjection);

            }
            else  if(event.keyCode == 40){
                glMatrix.mat4.ortho(mProjection,-5,5,-5,5,.001,100.0);
                setUniformVariable('u_projection',mProjection);

            }
            else if(event.keyCode == 67){

                ex = -1;
                ey = -1;
                ez = 1;
                glMatrix.mat4.lookAt(mView, [ex, ey, ez], [0, 0, 0], [0, 1, 0]);
                setUniformVariable('u_view',mView);
                
            }
            else{
                var angle = (2 * Math.PI) / 180;
                var mRotate = glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle, [1, 0, 0]);
                glMatrix.mat4.mul(mModel, mModel, mRotate);
                setUniformVariable('u_model',mModel);

            }
           
          
            gl.activeTexture(gl.TEXTURE0);
            gl.clearColor(0.75, 0.85, 0.8, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
        }


