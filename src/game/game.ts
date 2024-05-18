import * as THREE from "three";
import { createLight } from "./lib/createLights";
import { loadedAssets } from "../viewmodels/useAssetLoader";

import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Coin } from "./data/Coin";

const colors = {
    background: "#e7cfb4",
    board: "#c0c0c0",
    wood: "#da6d42",
    down: "#84240c",
    woodlight: "#ffc18c",
};
const distance = 20;
export default (assets: loadedAssets) => {
    const container = document.querySelector("div.gameContainer") as HTMLDivElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.background);

    const camera = new THREE.OrthographicCamera(
        window.innerWidth / -30,
        window.innerWidth / 30,
        window.innerHeight / 30,
        window.innerHeight / -30,
        -150,
        150
    );
    camera.position.set(distance, distance, distance * 2);

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    //#region LIGHTS
    createLight(
        [
            {
                color: 0xffffff,
                intensity: 2,
                type: "directional",
                rot: new THREE.Euler(0.1, 0.1, 0),
            },
            {
                color: 0xffffff,
                intensity: 0.7,
                type: "ambient",
                rot: new THREE.Euler(0.9, 0.5, 0),
            },
            {
                color: 0xffffff,
                intensity: 150,
                type: "spot",
                pos: new THREE.Vector3(0, 0, 10),
                rot: new THREE.Euler(0, 0, 0),
            },
        ],
        scene
    );
    //#endregion
    const updates: (() => void)[] = [];

    function _createMap() {
        {
            const h = 60;
            const w = 90;
            const above = new THREE.Mesh(
                new THREE.BoxGeometry(w, 0.5, h),
                new THREE.MeshStandardMaterial({
                    color: colors.wood,
                    map: assets.textures.board,
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

            scene.add(above);
            scene.add(below);
            scene.add(...sides);
        }
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
            scene.add(new Coin(coinState[0], coinState[1]));
        }
    }

    function _documentEvents() {
        function onWindowResize() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
        }
        window.addEventListener("resize", onWindowResize);
    }

    _createMap();
    _documentEvents();

    function animate() {
        requestAnimationFrame(animate);

        updates.map((fn) => fn());
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
    return {
        destroyer: () => {
            while (container.firstChild) container.removeChild(container.firstChild);
        },
    };
};
