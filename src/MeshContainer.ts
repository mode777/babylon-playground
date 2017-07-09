import { AbstractMesh, Node, Scene, Vector3 } from "babylonjs";

export class MeshContainer extends AbstractMesh {
    
    constructor(name: string, scene: Scene, protected _mesh: AbstractMesh){
        super(name, scene);
        this.position = this._mesh.position;
        this.rotation = this._mesh.rotation;
        this._mesh.parent = this;
        this._mesh.position = Vector3.Zero();
        this._mesh.rotation = Vector3.Zero();
    }
}