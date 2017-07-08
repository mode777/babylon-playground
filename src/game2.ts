import { Engine, Scene, FreeCamera, Light, Vector3, HemisphericLight, MeshBuilder, SceneLoader, Mesh, AbstractMesh, Camera, PointLight, Color3, ActionManager, InterpolateValueAction, Observable, FreeCameraGamepadInput, Xbox360Pad } from "babylonjs";

export class Game2 {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;

    private _camera: Camera;
    private _light: Light;
    private _planet: AbstractMesh;

    public readonly onUpdate: Observable<boolean> = new Observable<boolean>();

    constructor(canvasElement : string) {
        // Create canvas and engine
        this._canvas = <HTMLCanvasElement>document.getElementById(canvasElement);
        this._engine = new Engine(this._canvas, true);
    }

    createSceneAsync() : Promise<void> {
        return new Promise<void>((res,rej)=> {
            SceneLoader.Load("dist/assets/", "space2.babylon", this._engine, 
                scene => {
                    this._scene = scene;
                    this._loadAssets(scene);
                    res()
                }, 
                () => {}, 
                err => rej(err));
        });
    }

    private _loadAssets(scene: Scene){
        this._planet = this._scene.getMeshByName("Plane");
        this._camera = this._scene.getCameraByName("Camera");
        this._camera.attachControl(this._canvas);
        this._camera.maxZ = 500;       

        this._light = this._scene.getLightByName("Hemi");
        const gamepad = (<Xbox360Pad>(<FreeCameraGamepadInput>this._camera.inputs.attached["gamepad"]).gamepad);
        gamepad.onbuttonup(button => {
            switch(button){
                case 0: return this.shootLight();
            }

        });
    }

    animate() : void {

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

    shootLight() {
        const origin = this._camera.position.clone();
        const light = new PointLight("Point", origin.clone(), this._scene);
        light.diffuse = new Color3(1, 0, 0);
        light.specular = new Color3(1, 1, 1);
        light.intensity = 5;
        light.range = 30;

        const ray = this._camera.getForwardRay();
        const animator = () => {
            if(light.position.subtract(origin).length() > 200){
                this._scene.removeLight(light);
                this.onUpdate.removeCallback(animator);
                console.log("light destroyed")
            }

            light.position.addInPlace(ray.direction); 

        };

        this.onUpdate.add(animator);

    }
}

