import { AbstractMesh, Node, Scene, Vector3, ArcFollowCamera } from "babylonjs";
import { IUpdateProvider } from "./IUpdateProvider";
import { IInputProvider } from "./IInputProvider";
import { MeshContainer } from "./MeshContainer";
import { clamp, step } from "./math";

export class SpaceShip extends MeshContainer {
    private _thrust: number = 0;
    
    private _yawTarget = 0;
    private _yawCurrent = 0;
    private _yawAcc = 0.0005;
    private _yawRange = [-0.005, 0.005]

    private _roll = 0;
    private _maxRoll = 0.5;

    private _pitchTarget = 0;
    private _pitchCurrent = 0;
    private _pitchAcc = 0.01;
    private _pitchRange = [-1, 1]

    private _updateHandler = () => this._update();
    
    constructor(name: string, scene: Scene, mesh: AbstractMesh){
        super(name, scene, mesh);

        this.getScene().onBeforeRenderObservable.add(this._updateHandler);
        
        this.onDisposeObservable.add(() => 
            this.getScene()
                .onBeforeRenderObservable
                .removeCallback(this._updateHandler))
    }

    protected _update() {
        // update specs
        this._yawCurrent = step(this._yawCurrent, this._yawTarget, this._yawAcc);
        this._pitchCurrent = step(this._pitchCurrent, this._pitchTarget, this._pitchAcc);
        if(this._yawCurrent > 0){
            this._roll = (this._yawCurrent / this._yawRange[1]) * this._maxRoll; 
        }
        else if(this._yawCurrent < 0){
            this._roll = -(this._yawCurrent / this._yawRange[0]) * this._maxRoll; 
        }
        else {
            this._roll = 0;
        }
        
        // update transformations
        this.rotation.y += this._yawCurrent;
        this.rotation.x = this._pitchCurrent;
        this.rotation.z = this._roll;
        this.movePOV(0,0,this._thrust);
    }

    get thrust() { return this._thrust; }
    get yaw() { return this._yawCurrent; }
    get pitch() { return this._pitchCurrent; }

    set thrust(value: number) {
        this._thrust = value;
    }

    setTargetYaw(value: number){
        this._yawTarget = clamp(value, this._yawRange[0], this._yawRange[1]);
    }

    setTargetPitch(value: number){
        this._pitchTarget = clamp(value, this._pitchRange[0], this._pitchRange[1]);
    }

}