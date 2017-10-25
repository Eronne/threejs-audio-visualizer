import Ellipse from './Ellipse'
import utils from './../helpers/utils'
import Sound from './Sound'
import music from './../assets/sounds/music.mp3'

let OrbitControls = require('three-orbit-controls')(THREE),
    Stats = require('stats.js'),
    nbEllipse = 250,
    arrayEllipse = [],
    rotationValue = 10,
    time = 0,
    enableRotation = true,
    playSound = true,
    debug = false;

export default class App {

    constructor() {
        this.createScene()
        this.createEllipse()
        this.renderer()
        this.importAudio()
        if (debug) {
            this.debug()
        }
    	

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
        this.camera.position.z = 30;
        let controls = new OrbitControls(this.camera)
        controls.minDistance = 30;
        controls.maxDistance = 40;

        this.scene = new THREE.Scene();
    }

    createEllipse() {
        this.groupEllipse = new THREE.Group();

        for (let i = 0; i < nbEllipse; i++) {            
            let ellipse = new Ellipse(0, 0, 10, 10, 0, Math.PI, false, 0, rotationValue, i)
            arrayEllipse.push(ellipse);
            this.groupEllipse.add( ellipse.line );
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

    render() {
        this.stats.begin();         

        if (enableRotation) {
            this.groupEllipse.rotation.x += Math.cos(rotationValue) * 0.005
            this.groupEllipse.rotation.y += Math.sin(rotationValue) * 0.01
        }

        if (playSound) {
            this.midAverage = utils.arrAverage(this.audio.getSpectrum()) / 200
            
            arrayEllipse.forEach(ellipse => {
                ellipse.update(this.midAverage)
            })
        } else {
            time += 0.016;

            arrayEllipse.forEach(ellipse => {
                ellipse.update(time)
            })
        }

        this.renderer.render( this.scene, this.camera );

        this.stats.end();
    }

    importAudio() {
        if (debug) {
            this.audio = new Sound(music, null, null, null, true);
        } else {
            this.audio = new Sound(music, null, null, null, false);
        }
        this.kick = this.audio.createKick({
            frequency: [100, 150],
            threshold: 90,
            decay: 1,
            onKick: () => {
                time += 0.016
            },
            offKick: () => {
                
            }
        })
        this.kick.on();
        if (playSound) {
            this.audio._load(music, () => {
                this.audio.play();
            })
        }
    }

    onWindowResize() {

    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    debug() {
        let axisHelper = new THREE.AxisHelper( 20 )
        this.scene.add( axisHelper )
    }
}
