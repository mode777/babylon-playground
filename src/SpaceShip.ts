import { AbstractMesh, Node, Scene, Vector3, ArcFollowCamera } from "babylonjs";
import { MeshContainer } from "./MeshContainer";
import { clamp, step } from "./math";
import { IEntityController } from "./IEntityController";
import { SpaceShipState } from "./SpaceshipControllers";
import { EntityControl } from "./EntityControl";

export class SpaceShip extends MeshContainer {
    
    private _thrust = new EntityControl(0, 0.01, [0,0.5]);
    private _yaw = new EntityControl(0, 0.001, [-0.02, 0.02]);
    private _pitch = new EntityControl(0, 0.03, [-0.5,0.5]);

    private _roll = 0;
    private _maxRoll = 0.5;

    private _updateHandler = () => this._update();
    
    constructor(name: string, scene: Scene, mesh: AbstractMesh, private _controller: IEntityController<SpaceShipState>){
        super(name, scene, mesh);

        this.getScene().onBeforeRenderObservable.add(this._updateHandler);
        
        this.onDisposeObservable.add(() => 
            this.getScene()
                .onBeforeRenderObservable
                .removeCallback(this._updateHandler))
    }

    protected _update() {
        // process inputs
        const inputs = this._controller.getInputs();
        this._thrust.setTarget(inputs.thrust * this._thrust.max);
        this._yaw.setTarget(inputs.yaw > 0 
            ? inputs.yaw * this._yaw.max
            : inputs.yaw * -this._yaw.min);
        this._pitch.setTarget(inputs.pitch > 0 
            ? inputs.pitch * this._pitch.max
            : inputs.pitch * -this._pitch.min);
        

        // update specs
        this._yaw.update();
        this._pitch.update();
        this._thrust.update();
        const yaw = this._yaw.value;
        if(this._yaw.value > 0){
            this._roll = (yaw / this._yaw.max) * this._maxRoll; 
        }
        else if(yaw < 0){
            this._roll = -(yaw / this._yaw.min) * this._maxRoll; 
        }
        else {
            this._roll = 0;
        }
        
        // update transformations
        this.rotation.y += this._yaw.value;
        this.rotation.x = this._pitch.value;
        this.rotation.z = this._roll;
        this.movePOV(0,0,this._thrust.value);
    }

    get thrust() { return this._thrust.value; }
    get yaw() { return this._yaw.value; }
    get pitch() { return this._pitch.value; }

    setThrust(value: number) {
        this._thrust.setTarget(value);
    }

    setYaw(value: number){
        this._yaw.setTarget(value);
    }

    setPitch(value: number){
        this._pitch.setTarget(value);
    }

}