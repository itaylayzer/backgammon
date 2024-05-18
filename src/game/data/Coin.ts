import * as THREE from "three";
import clamp from "../lib/clamp";
const radius = 2;
const height = 0.5;
export class Coin extends THREE.Mesh {
    static coins: Coin[][];

    private pos: number;
    private index: number;

    static {
        this.coins = [];
        for (let index = 0; index < 24; index++) {
            this.coins.push([]);
        }
    }

    constructor(pos: number, enemy: boolean) {
        super(new THREE.CylinderGeometry(radius, radius, height, 50, 50), new THREE.MeshStandardMaterial({ color: enemy ? "#e0e0e0" : "#1a1a1a" }));

        this.pos = pos;
        this.index = Coin.coins[pos].length;
        Coin.coins[pos].push(this);

        this.position.y = height;
        const secondRow = this.pos >= 12;
        const secondHouse = pos > 5 && pos < 18;
        this.position.z = +secondRow * 54 - 27 + (secondRow ? -1 : 1) * this.index * radius * 2.2;
        this.position.x = 42.5 - (clamp(pos, 0, 12) - (clamp(pos, 12, 23) - 12 + +secondRow)) * 7.35 + -secondHouse * 3.5;
    }
}
