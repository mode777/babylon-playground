import { IEntityController } from "./IEntityController";
import { Observable, Gamepads, Gamepad, Xbox360Pad } from "babylonjs";

export interface SpaceShipState {
    thrust: number,
    yaw: number,
    pitch: number,
    fire: boolean
}

export class GamepadSpaceShipController implements IEntityController<SpaceShipState> {
    
    private readonly _gamepadAngularSensibility = 200;
    private readonly _gamepadMoveSensibility = 40;
    private readonly _deadzone = 0.2;

    private readonly _gamepads = new Gamepads((gamepad: Gamepad) => this._connected(gamepad));
    private _gamepad: Xbox360Pad;
    private _state: SpaceShipState = {
        thrust: 0,
        yaw: 0,
        pitch: 0,
        fire: false
    };

    constructor(){
    }

    private _connected(gamepad: Gamepad){
        if(!this._gamepad && gamepad.type === Gamepad.XBOX){
            console.log("Gamepad connected");
            this._gamepad = <Xbox360Pad>gamepad;
        }
    }

    getInputs(): SpaceShipState {
        if (this._gamepad) {
            // get values with deadzone
            const leftStick = this._gamepad.leftStick;
            const x = Math.abs(leftStick.x) > this._deadzone ? leftStick.x : 0;
            const y = Math.abs(leftStick.y) > this._deadzone ? leftStick.y : 0; 

            //convert to state
            this._state.thrust = this._gamepad.buttonA === 1 ? 1 : 0;
            this._state.yaw = x;
            this._state.pitch = y;
        }
        
        return this._state;
    }

    public get isConnected() { return !!this._gamepad; }
}