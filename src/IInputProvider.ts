import { Observable } from "babylonjs";

export interface InputEvent {
    name: string,
    value: any
}

export interface IInputProvider {
    onInput: Observable<InputEvent>;
}