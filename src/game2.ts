import { Engine, Scene, FreeCamera, Light, Vector3, HemisphericLight, MeshBuilder, SceneLoader, Mesh, AbstractMesh, Camera, PointLight, Color3, ActionManager, InterpolateValueAction, Observable, FreeCameraGamepadInput, Xbox360Pad } from "babylonjs";

export class Game2 {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;

    private _camera: Camera;
    private _sun: Light;
    private _laser: AbstractMesh;
    private _laserLight: PointLight;

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
        
        this._camera = this._scene.getCameraByName("Camera");
        this._camera.attachControl(this._canvas);
        this._camera.maxZ = 500; 

        this._laser = this._scene.getMeshByName("laser");
        this._laser.position = this._camera.position;

        this._sun = this._scene.getLightByName("Hemi");

        this._laserLight = new PointLight("Point", this._camera.position, this._scene);
        this._laserLight.diffuse = new Color3(1, 0, 0);
        this._laserLight.specular = new Color3(1, 1, 1);
        this._laserLight.intensity = 5;
        this._laserLight.range = 30;

        this._laserLight.setEnabled(false);

        const gamepad = (<Xbox360Pad>(<FreeCameraGamepadInput>this._camera.inputs.attached["gamepad"]).gamepad);
        
        gamepad.onbuttonup(async button => {
            console.log("down")
            switch(button){
                case 0: {
                    this._laserLight.setEnabled(false);
                }
            }

        });
        gamepad.onbuttondown(async button => {
            switch(button){
                case 0: {
                    this._laserLight.setEnabled(true);
                    await this.wait(100);
                    this._laserLight.setEnabled(false);
                }
            }

        });
    }

      

    animate() : void {
        //Vector3.RotationFromAxis();
        // run the render loop

        this._engine.runRenderLoop(() => {
            
            this.onUpdate.notifyObservers(true);
            //this._planet.rotation.y += 0.01;
            this._scene.render();
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }

    initAsync(){
        return new Promise<void>((res,rej) => this._scene.onReadyObservable.add(() => res()));
    }

    async shootLight() {
        
        const ray = this._camera.getForwardRay();

    }

    private wait(ms: number){
        return new Promise<void>((res)=> setTimeout(() => res(), ms));
    }

}

