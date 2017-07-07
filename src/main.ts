import { Game } from "./game";
import { Game2 } from "./game2";

window.addEventListener('DOMContentLoaded', async () => {
    // Create the game using the 'renderCanvas'
    let game = new Game2('renderCanvas');

    // Create the scene
    await game.createSceneAsync();

    // start animation
    game.animate();
});