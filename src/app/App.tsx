import AssetLoader from "../components/AssetLoader";
import { useStyles } from "../hooks/useStyles";
import { useApScreens } from "../viewmodels";

function App() {
    useApScreens();

    return (
        <>
            <div style={styles.gameContainer} className="gameContainer"></div>
            <p style={styles.header}>
                backgammon -{" "}
                <a style={styles.href} href="http://itaylayzer.github.io/">
                    itay layzer
                </a>
            </p>
        </>
    );
}

const styles = useStyles({
    gameContainer: {
        position: "absolute",
        boxSizing: "border-box",
        display: "block",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        minHeight: "100%",
        minWidth: "100%",
    },
    header: {
        zIndex: 2,
        color: "white",
        fontSize: 16,
        position: "absolute",
        boxSizing: "border-box",
        display: "block",
        top: 0,
        left: 0,
        fontFamily: "monospace",
        textAlign: "center",
        width: "100%",
    },
    href: {
        color: "rgb(41, 131, 255)",
    },
});

export default () => (
    <AssetLoader
        items={{
            board: "textures/board.png",
            dice1: "textures/dices/di1.png",
            dice2: "textures/dices/di2.png",
            dice3: "textures/dices/di3.png",
            dice4: "textures/dices/di4.png",
            dice5: "textures/dices/di5.png",
            dice6: "textures/dices/di6.png",
        }}
    >
        <App />
    </AssetLoader>
);
