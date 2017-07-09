import { Observable } from "babylonjs";

export interface IUpdateProvider {
    onUpdate: Observable<boolean>;
}