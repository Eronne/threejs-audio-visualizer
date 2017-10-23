// example import asset
// import imgPath from './assets/img.jpg';

// TODO: add Dat.GUI

import texturePath from './../assets/texture.jpg';

var OrbitControls = require('three-orbit-controls')(THREE)
let Stats = require('stats.js');

export default class App {

    constructor() {

        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10 );
        this.camera.position.z = 4;
        var controls = new OrbitControls(this.camera)


        this.scene = new THREE.Scene();
        
        let geometry = new THREE.TorusKnotGeometry( 0.5, 0.19, 300, 20 );        
        let textureLoader = new THREE.TextureLoader();
        let texture = textureLoader.load(texturePath)
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
        texture.repeat.set( 6, 6 );
        let material = new THREE.MeshLambertMaterial({color: 0xffffff, map: texture});

        this.mesh = new THREE.Mesh( geometry, material );
        this.scene.add( this.mesh );

        let directionalLight = new THREE.DirectionalLight( 0xffffff, 1.3 );
        this.scene.add( directionalLight )

    	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    	this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    	this.container.appendChild( this.renderer.domElement );

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

        this.renderer.animate( this.render.bind(this) );
    }

    render() {
        this.stats.begin();

        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;
        this.renderer.render( this.scene, this.camera );

        this.stats.end();
    }

    onWindowResize() {

    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}
