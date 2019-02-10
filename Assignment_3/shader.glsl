                 precision mediump float;
                 attribute vec3 position;
                 uniform float u_angle;
                 float angleRadian =  radians(u_angle);
                 float SIN = sin(angleRadian);
                 float COS = cos(angleRadian);
                // 'mat3 transformMatrix = mat3(1,0,0,0,COS,SIN,0,-SIN,COS);
                 mat3 transformMatrix = mat3(1,0,0,0,COS,-SIN,0,SIN,COS);
                 void main(void) {
              
                 gl_Position = vec4((position * transformMatrix),1);
                   gl_PointSize = 1.0;
                };