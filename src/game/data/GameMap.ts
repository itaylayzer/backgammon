import * as THREE from "three";
import * as CANNON from "cannon-es";

import { colors } from "../constants";
import { Coin } from "./Coin";
import { Dice } from "./Dice";

export class GameMap extends THREE.Group {
    private isClientTurn: boolean;
    private hasRolled: boolean;

    constructor(textures: THREE.Texture, world: CANNON.World) {
        super();

        this.hasRolled = false;
        this.isClientTurn = true;

        this.initBoard(textures, world);
        this.initCoins();
    }

    private initBoard(textures: THREE.Texture, world: CANNON.World) {
        const h = 60;
        const w = 90;
        const above = new THREE.Mesh(
            new THREE.BoxGeometry(w, 0.5, h),
            new THREE.MeshStandardMaterial({
                color: colors.wood,
                map: textures,
            })
        );
        const below = new THREE.Mesh(
            new THREE.BoxGeometry(w, 0.5, h),
            new THREE.MeshStandardMaterial({
                color: colors.down,
            })
        );

        const sides = [
            new THREE.Mesh(
                new THREE.BoxGeometry(w, 2, 1),
                new THREE.MeshStandardMaterial({
                    color: colors.woodlight,
                })
            ),
            new THREE.Mesh(
                new THREE.BoxGeometry(w, 2, 1),
                new THREE.MeshStandardMaterial({
                    color: colors.woodlight,
                })
            ),
            new THREE.Mesh(
                new THREE.BoxGeometry(h, 2, 1),
                new THREE.MeshStandardMaterial({
                    color: colors.woodlight,
                })
            ),
            new THREE.Mesh(
                new THREE.BoxGeometry(h, 2, 1),
                new THREE.MeshStandardMaterial({
                    color: colors.woodlight,
                })
            ),
            new THREE.Mesh(
                new THREE.BoxGeometry(h, 2, 2),
                new THREE.MeshStandardMaterial({
                    color: colors.woodlight,
                })
            ),
        ];

        for (const side of sides) {
            side.position.y = 1;
        }

        sides[0].position.z = h / 2;
        sides[1].position.z = -h / 2;
        sides[2].position.x = -w / 2;
        sides[3].position.x = w / 2;

        sides[2].rotation.y = -Math.PI / 2;
        sides[3].rotation.y = -Math.PI / 2;
        sides[4].rotation.y = -Math.PI / 2;

        sides[2].rotation;
        sides[3].rotation;

        below.position.y = -0.5;

        super.add(above);
        super.add(below);
        super.add(...sides);

        // main body
        world.addBody(
            new CANNON.Body({
                shape: new CANNON.Box(new CANNON.Vec3(w / 2, 0.5, h / 2)),
                mass: 0,
            })
        );
        // middle body

        world.addBody(
            new CANNON.Body({
                shape: new CANNON.Box(new CANNON.Vec3(h / 2, 2, 1)),
                mass: 0,
                quaternion: new CANNON.Quaternion().setFromEuler(0, -Math.PI / 2, 0),
            })
        );
    }
    private initCoins() {
        const initialMode: Array<[number, boolean]> = [
            [0, true],
            [0, true],

            [5, false],
            [5, false],
            [5, false],
            [5, false],
            [5, false],

            [7, false],
            [7, false],
            [7, false],

            [11, true],
            [11, true],
            [11, true],
            [11, true],
            [11, true],

            [12, false],
            [12, false],
            [12, false],
            [12, false],
            [12, false],

            [16, true],
            [16, true],
            [16, true],

            [18, true],
            [18, true],
            [18, true],
            [18, true],
            [18, true],

            [23, false],
            [23, false],
        ];

        for (const coinState of initialMode) {
            super.add(new Coin(coinState[0], coinState[1]));
        }
    }

    public async rollDice(world: CANNON.World, assets: Record<string, THREE.Texture>) {
        Dice.clear(world, this);
        const promises = [Dice.roll(world, this, assets), Dice.roll(world, this, assets)];
        const rollResult = await Promise.all(promises);
        console.log(rollResult);
    }

    get rollable(): boolean {
        return !this.hasRolled && this.isClientTurn;
    }
}
