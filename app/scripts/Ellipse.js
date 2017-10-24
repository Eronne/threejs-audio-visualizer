let time = Date.now() / 1000;

export default class Ellipse {
    constructor(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation) {
        this.curve = new THREE.EllipseCurve(
            aX, aY,
            xRadius, yRadius,
            aStartAngle, aEndAngle,
            aClockwise,
            aRotation
        );

        let path = new THREE.Path( this.curve.getPoints( 100 ) );
        let geometry = path.createPointsGeometry( 100 );
        let material = new THREE.LineBasicMaterial( { color : 0xd2a0a4 } );

        this.line = new THREE.Line( geometry, material );
        this.line.rotation.x += Math.cos(time) * Math.random() * (10 - 0) + 0
    }
}
