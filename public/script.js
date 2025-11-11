(function(){
  const canvas = document.getElementById('gl');
  const gl = canvas && canvas.getContext('webgl', { alpha:true, antialias:false, depth:false, stencil:false, preserveDrawingBuffer:false });
  if(!gl || !canvas){ return; }

  const vertSrc = `
    attribute vec2 a;
    void main(){ gl_Position = vec4(a, 0.0, 1.0); }
  `;

  const fragSrc = `
    precision highp float;
    uniform vec2 r;    // resolution
    uniform float t;   // time
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
    float noise(vec2 p){
      vec2 i = floor(p); vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0,0.0));
      float c = hash(i + vec2(0.0,1.0));
      float d = hash(i + vec2(1.0,1.0));
      vec2 u = f*f*(3.0-2.0*f);
      return mix(a,b,u.x) + (c - a)*u.y*(1.0-u.x) + (d - b)*u.x*u.y;
    }
    void main(){
      vec2 uv = gl_FragCoord.xy / r.xy;
      vec2 p = vec2(uv.x*1.2, uv.y*1.2);
      float n1 = noise(p*3.0 + vec2(0.0, t*0.30));
      float n2 = noise(p*8.0 + vec2(t*0.15, -t*0.22));
      float scan = sin(uv.y*1200.0 + t*18.0)*0.04;
      float drift = noise(vec2(uv.y*40.0, t*0.8))*0.10;
      float bar = smoothstep(0.0, 0.02, abs(fract(uv.y*8.0 + t*0.4)-0.5)) * 0.4;
      float glitch = step(0.97, fract(sin(t*53.0)*43758.5453));
      float g = n1*0.55 + n2*0.30 + scan + drift + bar*glitch;

      vec3 base = vec3(0.12, 0.0, 0.10);       // Grundton: leicht pink-violett
      vec3 mag  = vec3(1.0, 0.3, 1.0);         // Pink mit kleinem Rotanteil
      vec3 glow = vec3(1.0, 0.8, 1.0);         // sanfter Weiß-Pink-Schimmer
      vec3 c = base + mag * (0.30 + g*0.40) + glow * 0.10;


      vec2 d = uv-0.5; float vig = 1.0 - dot(d,d)*1.2;
      c *= clamp(vig, 0.15, 1.0);

      gl_FragColor = vec4(c, 1.0);
    }
  `;

  function compile(type, src){
    const sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh);
    return sh;
  }
  const vs = compile(gl.VERTEX_SHADER, vertSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  gl.useProgram(prog);

  const a = gl.getAttribLocation(prog, 'a');
  const ur = gl.getUniformLocation(prog, 'r');
  const ut = gl.getUniformLocation(prog, 't');

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  const quad = new Float32Array([ -1,-1,  1,-1,  -1, 1,  -1, 1,  1,-1,  1, 1 ]);
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(a);
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);

  function resize(){
    const w = Math.floor(window.innerWidth * (window.devicePixelRatio||1));
    const h = Math.floor(window.innerHeight* (window.devicePixelRatio||1));
    if(canvas.width!==w || canvas.height!==h){ canvas.width=w; canvas.height=h; }
    gl.viewport(0,0,canvas.width,canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  let start = performance.now();
  (function loop(){
    const t = (performance.now()-start)/1000;
    gl.uniform2f(ur, canvas.width, canvas.height);
    gl.uniform1f(ut, t);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(loop);
  })();
})();
