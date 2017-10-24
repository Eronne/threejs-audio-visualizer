// example import asset
// import imgPath from './assets/img.jpg';

// TODO: add Dat.GUI

import texturePath from './../assets/img/texture.jpg'
import Sound from './Sound'
import music from './../assets/sounds/music.mp3'

let OrbitControls = require('three-orbit-controls')(THREE)
let Stats = require('stats.js');

let nbEllipse = 65;
let arrayEllipse = [];

let time = Date.now() / 1000;

export default class App {

    constructor() {
        this.createScene()
        this.createLights()
        this.createEllipse()
        this.renderer()
        this.importAudio()
    	

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();
    }

    createScene() {
        this.container = document.querySelector( '#main' );
        document.body.appendChild( this.container );
        
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
        this.camera.position.z = 20;
        let controls = new OrbitControls(this.camera)

        this.scene = new THREE.Scene();

        let axisHelper = new THREE.AxisHelper( 5 )
        this.scene.add( axisHelper )
    }

    createLights() {
        let directionalLight = new THREE.DirectionalLight( 0xffffff, 1.3 );
        this.scene.add( directionalLight )
    }

    createEllipse() {
        this.groupEllipse = new THREE.Group();
        
        
                for (var i = 0; i < nbEllipse; i++) {
                    var curve = new THREE.EllipseCurve(
                        0,  0,            // ax, aY
                        10, 10,           // xRadius, yRadius
                        0,  2 * Math.PI,  // aStartAngle, aEndAngle
                        false,            // aClockwise
                        Math.PI / 2           // aRotation
                    );
                    
                    var path = new THREE.Path( curve.getPoints( 100 ) );
                    var geometry = path.createPointsGeometry( 100 );
                    var material = new THREE.LineBasicMaterial( { color : 0xd2a0a4 } );
                    
                    // Create the final object to add to the scene
                    this.ellipse = new THREE.Line( geometry, material );
                    this.ellipse.rotation.x += Math.cos(time) * i
                    arrayEllipse.push(this.ellipse);
                    
                    this.groupEllipse.add( this.ellipse );
                }
        
                this.scene.add(this.groupEllipse)
    }

    renderer() {
        this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    	this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.container.appendChild( this.renderer.domElement );
        
        this.renderer.animate( this.render.bind(this) );
    }

    importAudio() {
        this.audio = new Sound(music, null, null, null, true);
        this.audio._load(music, () => {
            // this.audio.play();
        })
    }

    render() {
        this.stats.begin();

        this.groupEllipse.rotation.x += Math.cos(time) * 0.01
        this.groupEllipse.rotation.y += Math.sin(time) * 0.01

        this.renderer.render( this.scene, this.camera );

        this.stats.end();
    }

    onWindowResize() {

    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}
