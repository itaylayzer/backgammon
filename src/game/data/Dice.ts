import * as THREE from "three";
import * as CANNON from "cannon-es";
import { randFloat } from "three/src/math/MathUtils.js";

export class Dice {
    private mesh: THREE.Mesh;
    private body: CANNON.Body;
    private updateFn: () => void;
    constructor(world: CANNON.World, group: THREE.Group, textures: Record<string, THREE.Texture>) {
        const mats: THREE.Material[] = [];

        for (let index = 1; index < 7; index++) {
            const texture = textures[`dice${index}`];
            texture.name = index.toString();
            mats.push(
                new THREE.MeshBasicMaterial({
                    map: texture,
                })
            );
        }
        const w = 2;

        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(w, w, w), mats);

        this.body = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Box(new CANNON.Vec3(0.5 * w, 0.5 * w, 0.5 * w)),
            position: new CANNON.Vec3(0, 10, 0),
            quaternion: new CANNON.Quaternion().setFromEuler(randFloat(0, Math.PI * 2), randFloat(0, Math.PI * 2), randFloat(0, Math.PI * 2)),
            velocity: new CANNON.Vec3(randFloat(-1, 1), -1, randFloat(-1, 1)),
        });

        this.updateFn = () => {
            this.mesh.position.copy(this.body.position);
            this.mesh.quaternion.copy(this.body.quaternion);
        };

        group.add(this.mesh);
        world.addBody(this.body);

        this.updateFn();
    }
    private get velocityZero(): boolean {
        for (const axis of [this.body.velocity.x, this.body.velocity.y, this.body.velocity.z]) {
            if (Math.abs(axis) > 0.01) return false;
        }
        return true;
    }
    private get diceNumber(): number {
        return 0;
    }

    private static dices: Dice[];
    static {
        this.dices = [];
    }
    public static async clear(world: CANNON.World, group: THREE.Group) {
        for (const dice of this.dices) {
            world.removeBody(dice.body);
            group.remove(dice.mesh);
        }
    }
    public static roll(world: CANNON.World, group: THREE.Group, assets: Record<string, THREE.Texture>): Promise<number> {
        return new Promise<number>((resolve) => {
            const dice = new Dice(world, group, assets);
            this.dices.push(dice);

            const interval = setInterval(() => {
                if (dice.velocityZero) {
                    clearInterval(interval);
                    resolve(dice.diceNumber);
                }
            }, 17);
        });
    }

    public static get updates() {
        return this.dices.map((v) => v.updateFn);
    }
}
