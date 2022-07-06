export default {
    uniforms: {
        color: {
            value: null
        },

        tDiffuse: {
            value: null
        },

        textureMatrix: {
            value: null
        },

        opacity: {
            value: 1.0
        }
    },

    vertexShader: /* glsl */ `
        uniform mat4 textureMatrix;
        varying vec4 vUv;

        #include <common>
        #include <logdepthbuf_pars_vertex>

        void main() {

            vUv = textureMatrix * vec4( position, 1.0 );

            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

            #include <logdepthbuf_vertex>

        }`,

    fragmentShader: /* glsl */ `
        uniform vec3 color;
        uniform sampler2D tDiffuse;
        uniform float opacity;
        varying vec4 vUv;

        #include <logdepthbuf_pars_fragment>

        float blendOverlay( float base, float blend ) {

            return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

        }

        vec3 blendOverlay( vec3 base, vec3 blend ) {
            float r = blendOverlay( base.r, blend.r );
            float g = blendOverlay( base.g, blend.g );
            float b = blendOverlay( base.b, blend.b );

            return vec3( r, g, b );

        }

        void main() {

            #include <logdepthbuf_fragment>

            vec4 base = texture2DProj( tDiffuse, vUv );
            gl_FragColor = vec4( blendOverlay( base.rgb, color ), opacity );

            #include <encodings_fragment>

        }`
}
