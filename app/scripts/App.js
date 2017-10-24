import Ellipse from './Ellipse'
import Sound from './Sound'
import music from './../assets/sounds/music.mp3'

let OrbitControls = require('three-orbit-controls')(THREE),
    Stats = require('stats.js'),
    nbEllipse = 65,
    arrayEllipse = [],
    time = Date.now() / 1000,
    playSound = false,
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
            let ellipse = new Ellipse(0, 0, 10, 10, 0, 2 * Math.PI, false, 0, i)
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

        this.groupEllipse.rotation.x += Math.cos(time) * 0.005
        this.groupEllipse.rotation.y += Math.sin(time) * 0.01

        this.renderer.render( this.scene, this.camera );

        this.stats.end();
    }

    importAudio() {
        this.audio = new Sound(music, null, null, null, true);
        this.kick = this.audio.createKick({
            frequency: [100, 150],
            threshold: 90,
            decay: 1,
            onKick: () => {
                console.log('On kick')
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
