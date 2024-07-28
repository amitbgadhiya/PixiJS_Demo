
const app = new PIXI.Application();
await app.init({
    backgroundColor: "#1099bb",
    resizeTo: window
});
document.body.appendChild(app.canvas);

function WIDTH() {
    return app.canvas.width;
}
function HEIGHT() {
    return app.canvas.height;
}

const THIS = new PIXI.Container();
THIS.x = WIDTH() / 2;
THIS.y = HEIGHT() / 2;
THIS.pivot.x = THIS.width / 2;
THIS.pivot.y = THIS.height / 2;
app.stage.addChild(THIS);

async function loadAllTextures() {

    let basicText = new PIXI.Text({
        text: 'Loading assets ...0%',
        style: {
            fill: "#FFFFFF"
        }
    });
    basicText.anchor.set(0.5);
    basicText.x = 0;
    basicText.y = 0;
    THIS.addChild(basicText);

    PIXI.Assets.addBundle('textures', {
        HV1: "images/hv1_symbol.png",
        HV2: "images/hv2_symbol.png",
        HV3: "images/hv3_symbol.png",
        HV4: "images/hv4_symbol.png",
        LV1: "images/lv1_symbol.png",
        LV2: "images/lv2_symbol.png",
        LV3: "images/lv3_symbol.png",
        LV4: "images/lv4_symbol.png",
        BTN_SPIN: "images/spin_button.png"
    });
    return await PIXI.Assets.loadBundle('textures', (progress) => {
        basicText.text = `Loading assets ...${(progress * 100).toFixed()}%`;
        if (progress * 100 >= 100) {
            console.log("Loading Done...");
            basicText.destroy({ children: true });
        }
    });
}

const textures = await loadAllTextures();


const ReelSet = {
    Band_1: ["hv2", "lv3", "lv3", "hv1", "hv1", "lv1", "hv1", "hv4", "lv1", "hv3", "hv2", "hv3", "lv4", "hv4", "lv1", "hv2", "lv4", "lv1", "lv3", "hv2"],
    Band_2: ["hv1", "lv2", "lv3", "lv2", "lv1", "lv1", "lv4", "lv1", "lv1", "hv4", "lv3", "hv2", "lv1", "lv3", "hv1", "lv1", "lv2", "lv4", "lv3", "lv2"],
    Band_3: ["lv1", "hv2", "lv3", "lv4", "hv3", "hv2", "lv2", "hv2", "hv2", "lv1", "hv3", "lv1", "hv1", "lv2", "hv3", "hv2", "hv4", "hv1", "lv2", "lv4"],
    Band_4: ["hv2", "lv2", "hv3", "lv2", "lv4", "lv4", "hv3", "lv2", "lv4", "hv1", "lv1", "hv1", "lv2", "hv3", "lv2", "lv3", "hv2", "lv1", "hv3", "lv2"],
    Band_5: ["lv3", "lv4", "hv2", "hv3", "hv4", "hv1", "hv3", "hv2", "hv2", "hv4", "hv4", "hv2", "lv2", "hv4", "hv1", "lv2", "hv1", "lv2", "hv4", "lv4"]
};

const TileSize = 256;
const rows = 3;
const columns = 5;
const maxSize = TileSize * 6;

THIS.width = maxSize;
THIS.height = maxSize;

function manageScreenResize() {
    let currentScrrenSize = WIDTH();
    if (currentScrrenSize > HEIGHT()) {
        currentScrrenSize = HEIGHT();
    }
    let newScale = 1.0 / (maxSize / currentScrrenSize);
    THIS.scale.set(newScale);
    THIS.x = WIDTH() / 2;
    THIS.y = HEIGHT() / 2;
}
manageScreenResize();
window.addEventListener("resize", manageScreenResize);


let reelContainer = null;
function addNewReel(data) {

    console.log("Data :", data);
    if (reelContainer) {
        reelContainer.destroy({ children: true });
    }
    reelContainer = new PIXI.Container();
    reelContainer.x = 0;
    reelContainer.y = -TileSize;
    reelContainer.pivot.x = reelContainer.width / 2;
    reelContainer.pivot.y = reelContainer.height / 2;
    THIS.addChild(reelContainer);

    let row = (rows - 1) / 2;
    let column = (columns - 1) / 2;
    let pX = -(TileSize * column);
    let pY = -(TileSize * row);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let tile = new PIXI.Sprite(getTextureForKey(data[i][j]));
            tile.anchor.set(0.5);
            tile.x = pX + TileSize * j;
            tile.y = pY + TileSize * i;
            reelContainer.addChild(tile);
        }
    }
}

function getTextureForKey(key) {
    switch (key) {
        case 'hv1': return textures.HV1;
        case 'hv2': return textures.HV2;
        case 'hv3': return textures.HV3;
        case 'hv4': return textures.HV4;

        case 'lv1': return textures.LV1;
        case 'lv2': return textures.LV2;
        case 'lv3': return textures.LV3;
        case 'lv4': return textures.LV4;

        default: return textures.BTN_SPIN;
    }
}

function getDataFor(positions) {
    positions.forEach(element => {
        if (element < 0) element = 0;
        if (element > 17) element = 17;
    });

    return [
        [
            ReelSet.Band_1[positions[0]],
            ReelSet.Band_2[positions[1]],
            ReelSet.Band_3[positions[2]],
            ReelSet.Band_4[positions[3]],
            ReelSet.Band_5[positions[4]]
        ],
        [
            ReelSet.Band_1[positions[0] + 1],
            ReelSet.Band_2[positions[1] + 1],
            ReelSet.Band_3[positions[2] + 1],
            ReelSet.Band_4[positions[3] + 1],
            ReelSet.Band_5[positions[4] + 1]
        ],
        [
            ReelSet.Band_1[positions[0] + 2],
            ReelSet.Band_2[positions[1] + 2],
            ReelSet.Band_3[positions[2] + 2],
            ReelSet.Band_4[positions[3] + 2],
            ReelSet.Band_5[positions[4] + 2]
        ]
    ];
}

const winText = new PIXI.Text({
    text: 'Tap on Spin and Get your winnings...',
    style: {
        fill: "#FFFFFF",
        fontSize: 50
    }
});
winText.anchor.set(0.5);
winText.x = -TileSize;
winText.y = TileSize * 1.25;
THIS.addChild(winText);

const spinBtn = new PIXI.Sprite(textures.BTN_SPIN);
spinBtn.anchor.set(0.5);
spinBtn.x = TileSize * 2;
spinBtn.y = TileSize * 1.25;
THIS.addChild(spinBtn);

spinBtn.eventMode = 'static';
spinBtn.cursor = 'pointer';
spinBtn.on('pointertap', startSpin);

// let tempPos = [
//     [0, 1, 1, 0, 0],//p1
//     [2, 2, 2, 0, 0],//p2
//     [0, 0, 0, 0, 0],//p3
//     [2, 2, 1, 0, 0],//p4
//     [0, 0, 1, 0, 0],//p5
//     [2, 1, 0, 0, 0],//p6
//     [0, 1, 2, 0, 0],//p7
// ];
// let tempLineCounter = 0;
function startSpin() {
    if (spinBtn.alpha == 1) {
        spinBtn.alpha = 0.5;
        setTimeout(() => {
            spinBtn.alpha = 1;
        }, 500);

        let positions = [];
        for (let i = 0; i < 5; i++) {
            positions.push(randomNumber(0, 17));
        }
        console.log(positions);
        // positions = tempPos[tempLineCounter];
        // tempLineCounter++;
        // if (tempLineCounter > tempPos.length - 1) tempLineCounter = 0;
        let data = getDataFor(positions);
        addNewReel(data);
        checkForPaylines(data);
    }
}

function randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function setGame() {
    addNewReel(getDataFor([0, 0, 0, 0, 0]));
}
setGame();



// PAYLINE MANAGE
function getWinningFor(key, noOfSymbols) {
    if (noOfSymbols < 3) return 0;
    switch (key) {
        case 'hv1':
            switch (noOfSymbols) {
                case 3: return 10;
                case 4: return 20;
                case 5: return 50;
            }
        case 'hv2':
            switch (noOfSymbols) {
                case 3: return 5;
                case 4: return 10;
                case 5: return 20;
            }
        case 'hv3':
            switch (noOfSymbols) {
                case 3: return 5;
                case 4: return 10;
                case 5: return 15;
            }
        case 'hv4':
            switch (noOfSymbols) {
                case 3: return 5;
                case 4: return 10;
                case 5: return 15;
            }

        case 'lv1':
            switch (noOfSymbols) {
                case 3: return 2;
                case 4: return 5;
                case 5: return 10;
            }
        case 'lv2':
            switch (noOfSymbols) {
                case 3: return 1;
                case 4: return 2;
                case 5: return 5;
            }
        case 'lv3':
            switch (noOfSymbols) {
                case 3: return 1;
                case 4: return 2;
                case 5: return 3;
            }
        case 'lv4':
            switch (noOfSymbols) {
                case 3: return 1;
                case 4: return 2;
                case 5: return 3;
            }
        default: return 0;
    }
}

function checkForPaylines(data) {
    let winnings = 0;
    let paylineData = "";
    PayLines.forEach((payline, index) => {
        let lineData = ["", "", "", "", ""];
        for (let i = 0; i < payline.length; i++) {
            for (let j = 0; j < payline[i].length; j++) {
                if (payline[i][j] == 1) {
                    lineData[j] = data[i][j];
                }
            }
        }
        let key = lineData[0];
        lineData.splice(0, 1);
        let counter = checkforPlayLineCounter(key, lineData);
        if (counter >= 3) {
            let winAmount = getWinningFor(key, counter);
            winnings += winAmount;
            paylineData += `\nPayline ${index + 1}, ${key} x${counter}, ${winAmount}`;
        }
    });

    if (winnings > 0) {
        winText.text = "Total wins: " + winnings + "\n" + paylineData;
    }
    else {
        winText.text = "Tap on Spin and Get your winnings...";
    }
}
function checkforPlayLineCounter(key, data) {
    let ctr = 1;

    for (let i = 0, j = 0; i < data.length; i++) {
        if (key == data[i] && i == j) {
            j++;
            ctr++;
        }
    }

    return ctr;
}
const PayLines = [
    [
        [0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0]
    ],
    [
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
    ],
    [
        [1, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 1]
    ],
    [
        [0, 0, 0, 1, 1],
        [0, 0, 1, 0, 0],
        [1, 1, 0, 0, 0]
    ],
    [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0]
    ],
    [
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1]
    ],
];
