import { Engine, Scene, FreeCamera, Light, Vector3, HemisphericLight, MeshBuilder, SceneLoader, Mesh, Camera, PointLight, Color3, ActionManager, InterpolateValueAction, Observable, FreeCameraGamepadInput, Xbox360Pad, FollowCamera, TargetCamera, ArcFollowCamera } from "babylonjs";
import { delay } from "./timing";
import { IUpdateProvider } from "./IUpdateProvider";
import { SpaceShip } from "./SpaceShip";

const ALPHA_ZERO = 0.001;

export class Game2 implements IUpdateProvider {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;

    private _camera: ArcFollowCamera;
    private _sun: Light;
    //private _laser: AbstractMesh;
    private _laserLight: PointLight;
    private _ship: SpaceShip;

    public readonly onUpdate: Observable<boolean> = new Observable<boolean>();

    constructor(canvasElement : string) {
        // Create canvas and engine
        this._canvas = <HTMLCanvasElement>document.getElementById(canvasElement);
        this._engine = new Engine(this._canvas, true);
    }

    createSceneAsync() : Promise<void> {
        return new Promise<void>((res,rej)=> {
            SceneLoader.Load("dist/assets/", "space2.babylon", this._engine, 
                async scene => {
                    this._scene = scene;
                    await this.initAsync;
                    this._loadAssets(scene);
                    res()
                }, 
                () => {}, 
                err => rej(err));
        });
    }

    private _loadAssets(scene: Scene){
        
        //this._laser = this._scene.getMeshByName("laser");

        const sceneCam = this._scene.getCameraByName("Camera");
        const sceneShip = this._scene.getMeshByName("ship");
        this._ship = new SpaceShip("SpaceShip", scene, sceneShip);
        this._ship.thrust = 0.1;
        this._ship.setTargetYaw(2);
        this._ship.setTargetPitch(0.5);

        this._camera = new ArcFollowCamera("Camera2", Math.PI / 2, 0, 30, this._ship, scene);
        this._scene.setActiveCameraByName("Camera2");
        this._camera.maxZ = 500; 
       
        this._sun = this._scene.getLightByName("Hemi");

        this._laserLight = new PointLight("Point", this._camera.position, this._scene);
        this._laserLight.diffuse = new Color3(1, 0, 0);
        this._laserLight.specular = new Color3(1, 1, 1);
        this._laserLight.intensity = 5;
        this._laserLight.range = 30;

        this._laserLight.setEnabled(false);      
    }    

    async animate() {

        this._engine.runRenderLoop(() => {
            this._camera.alpha = -this._ship.rotation.y + Math.PI/2;
            this.onUpdate.notifyObservers(true);
            //this._planet.rotation.y += 0.01;
            this._scene.render();
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this._engine.resize();
        });

        await delay(5000);
        this._ship.setTargetYaw(-2);
        await delay(10000);
        this._ship.setTargetYaw(0);
        this._ship.setTargetPitch(-0.5)
        this._ship.thrust = 0.5;
        await delay(5000);
        this._ship.setTargetPitch(0.0)
        this._ship.setTargetYaw(2);
    }

    initAsync(){
        return new Promise<void>((res,rej) => this._scene.onReadyObservable.add(() => res()));
    }

    async shootLight() {
        
        const ray = this._camera.getForwardRay();

    }

}

