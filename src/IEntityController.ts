import { Observable } from "babylonjs";

export interface IEntityController<TEvent> {
    getInputs() : TEvent;
}