import vertex from '../shaders/line.vert'
import fragment from '../shaders/line.frag'

export default class Ellipse {

    constructor(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation, rotationValue, counter) {
        this.curve = new THREE.EllipseCurve(
            aX, aY,
            xRadius, yRadius,
            aStartAngle, aEndAngle,
            aClockwise,
            aRotation
        );

        let path = new THREE.Path( this.curve.getPoints( 100 ) );
        let geometry = path.createPointsGeometry( 100 );
        this.material = new THREE.ShaderMaterial( {
            uniforms: THREE.UniformsUtils.merge( [
                THREE.UniformsLib.common,
                THREE.UniformsLib.specularmap,
                THREE.UniformsLib.envmap,
                THREE.UniformsLib.aomap,
                THREE.UniformsLib.lightmap,
                THREE.UniformsLib.fog,
                { 
                    diffuse: { value: new THREE.Color( 0xd2a0a4 ) },
                    u_time: { value: 1.0, type: 'f' }
                 }
            ] ),
            defines: {
                USE_ENVMAP: true
            },
                // Todo: Change color
                // color : 0xd2a0a4
            vertexShader: vertex,
            fragmentShader: fragment
        } );

        this.line = new THREE.Line( geometry, this.material );
        this.line.rotation.x += Math.cos(rotationValue) * counter
    }

    update(time) {
        this.material.uniforms.u_time.value = time
    }
}
