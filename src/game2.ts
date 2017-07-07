import { Engine, Scene, FreeCamera, Light, Vector3, HemisphericLight, MeshBuilder, SceneLoader, Mesh, AbstractMesh, Camera } from "babylonjs";

export class Game2 {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;

    private _camera: Camera;
    private _light: Light;
    private _planet: AbstractMesh;

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
        console.log(this._camera)
        this._light = this._scene.getLightByName("Hemi");
        this._scene.materials.forEach(x => {
            console.log(x);
        })
    }

    animate() : void {
        // run the render loop
        this._engine.runRenderLoop(() => {
            //this._planet.rotation.y += 0.01;
            this._scene.render();
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}

