import Ellipse from './Ellipse'
import utils from './../helpers/utils'
import Sound from './Sound'
import music from './../assets/sounds/music.mp3'

let OrbitControls = require('three-orbit-controls')(THREE),
    Stats = require('stats.js'),
    nbEllipse = 105,
    arrayEllipse = [],
    rotationValue = 10,
    time = 0,
    enableRotation = true,
    fullScreen = false,
    playSound = true,
    volume = true,
    debug = false;

export default class App {

    constructor() {
        this.createScene()
        this.createEllipse()
        this.renderer()
        this.importAudio()
        this.importControls()
        if (debug) {
            this.debug()
        }

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    createScene() {
        this.container = document.querySelector( '#main' );
        document.body.appendChild( this.container );
        
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
        this.camera.position.z = 30;

        let controls = new OrbitControls(this.camera, this.container)
        controls.minDistance = 20;
        controls.maxDistance = 30;
		controls.enableDamping = true;
		controls.dampingFactor = 0.07;
		controls.rotateSpeed = 0.07;

        this.scene = new THREE.Scene();
    }

    createEllipse() {
        this.groupEllipse = new THREE.Group();
        this.shapeSlider = document.getElementById('shape');

        for (let i = 0; i < nbEllipse; i++) {
            let ellipse = new Ellipse(0, 0, 10, 10, 0, 2 * Math.PI, false, 0, rotationValue, i, this.shapeSlider.value)
            arrayEllipse.push(ellipse);
            this.groupEllipse.add( ellipse.line );
        }

        this.scene.add(this.groupEllipse)


        this.changeShape()
    } 

    changeShape() {
        this.shapeSlider.addEventListener('change', () => {
            for (let i = 0; i < nbEllipse; i++) {
                let ellipse = arrayEllipse[i]
                ellipse.changeShape(this.shapeSlider.value)
            }
        })
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

        this.audio = new Sound(music, null, null, () => {
            console.log(this.audio.progress)

            if (playSound) {
                let landingPage = document.getElementById('landing')
                let loading = document.getElementById('loader')
                let landingButton = document.getElementById('landingButton')
                let controls = document.getElementById('controls')

                this.audio._load(music, () => {
                    loading.classList.add('hidden');
                    landingButton.classList.remove('hidden');
                    
                    landingButton.addEventListener('click', () => {
                        landingPage.style.display="none";
                        controls.classList.remove('hidden');
                        this.audio.play();
                    })
                })
            }
        }, debug);
    }

    importControls() {
        let muteButton =  document.getElementById('mute')
        muteButton.addEventListener('click', () => {
            muteButton.classList.toggle('visible')
        })

        document.getElementById('mute').addEventListener('click', () => {
            if (volume) {
                this.audio.volume = 0
                volume = false;
            } else {
                this.audio.volume = 1
                volume = true;
            }
        })

        let playOrPauseButton = document.getElementById('play-or-pause')

        playOrPauseButton.addEventListener('click', () => {
            if (this.audio.isPlaying) {
                this.audio.pause()
                playOrPauseButton.src="app/assets/img/play.svg"
            } else {
                this.audio.play()
                playOrPauseButton.src="app/assets/img/pause.svg"
            }
        })

        let fullScreenButton = document.getElementById('fullScreen')
        fullScreenButton.addEventListener('click', function () {
            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
    
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }

            fullScreenButton.classList.toggle('visible')
        });

        document.addEventListener('keydown', (e) => {
            if (e.target.nodeName.toLowerCase() !== 'input' && e.target.type !== 'text') {
                if(e.keyCode === 32) {
                    playOrPauseButton.click()
                }

                if(e.keyCode === 70) {
                    fullScreenButton.click()
                }

                if(e.keyCode === 77) {
                    muteButton.click()
                }
            }
        })
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
