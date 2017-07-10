import { clamp, step } from "./math";

export class EntityControl {
    
    private _target: number;
    private _value: number;

    constructor(
        private _inital: number,
        private _acceleration: number,
        private _range: number[]){
            this._value = this._inital;
            this._target = this._inital;
    }
    
    step(){
        this.update();
        return this._value;       
    }

    update(){
        this._value = step(this._value, this._target, this._acceleration);      
    }

    setTarget(value: number){
        this._target = clamp(value, this._range[0], this._range[1]);
    }

    get value(){
        return this._value;
    }

    get max() { return this._range[1]};
    get min() { return this._range[0]};
}