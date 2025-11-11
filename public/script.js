(function(){
  const canvas = document.getElementById('gl');
  const gl = canvas.getContext('webgl', { alpha:true, antialias:false });
  if(!gl) return;

  const vertSrc = `
    attribute vec2 a;
    void main(){ gl_Position = vec4(a, 0.0, 1.0); }
  `;

  const fragSrc = `
    precision highp float;
    uniform vec2 r;
    uniform float t;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p);
      float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
      vec2 u=f*f*(3.-2.*f);
      return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
    }
    void main(){
      vec2 uv=gl_FragCoord.xy/r.xy;
      float n=noise(uv*8.0+vec2(t*0.2,t*0.1));
      vec3 col=vec3(0.02,0.0,0.05)+vec3(1.0,0.0,1.0)*n*0.4;
      gl_FragColor=vec4(col,1.0);
    }
  `;

  function compile(type, src){
    const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s);
    return s;
  }
  const vs=compile(gl.VERTEX_SHADER,vertSrc);
  const fs=compile(gl.FRAGMENT_SHADER,fragSrc);
  const prog=gl.createProgram();
  gl.attachShader(prog,vs); gl.attachShader(prog,fs); gl.linkProgram(prog);
  gl.useProgram(prog);

  const a=gl.getAttribLocation(prog,'a');
  const ur=gl.getUniformLocation(prog,'r');
  const ut=gl.getUniformLocation(prog,'t');
  const buf=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(a);
  gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);

  function resize(){
    canvas.width=innerWidth; canvas.height=innerHeight;
    gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);
  }
  window.addEventListener('resize',resize);
  resize();

  const start=performance.now();
  (function loop(){
    const t=(performance.now()-start)/1000;
    gl.uniform2f(ur,canvas.width,canvas.height);
    gl.uniform1f(ut,t);
    gl.drawArrays(gl.TRIANGLES,0,6);
    requestAnimationFrame(loop);
  })();
})();
