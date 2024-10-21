class SlotMachineScene extends Phaser.Scene {

    private reels: Phaser.GameObjects.Container[] = [];
    private symbols: string[] = ['symbol1', 'symbol2', 'symbol3', 'symbol4', 'symbol5'];
    private displayedSymbols: string[][] = []; 

    private reelHeight: number = 4;   
    private symbolSize: number = 75;  
    private reelWidth: number = 3;   
    private spinSpeed: number = 80;  

    private mask!: Phaser.GameObjects.Graphics; 
    private spinDuration: number = 0;
    
    private spinButton!: Phaser.GameObjects.Text;
    private resultText!: Phaser.GameObjects.Text;

    constructor() {
        super({ 
            key: 'SlotMachineScene' 
        });
    }

    preload() {
    
        this.load.image('symbol1', './images/sedem.png');
        this.load.image('symbol2', './images/banana.png');
        this.load.image('symbol3', './images/lubenica.png');
        this.load.image('symbol4', './images/limona.png');
        this.load.image('symbol5', './images/bar.png');
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        //create static mask
        this.mask = this.make.graphics({});
        this.mask.fillStyle(0xffffff);
        this.mask.fillRect(
            centerX - (this.symbolSize * this.reelWidth) / 2,
            centerY - (this.symbolSize * (this.reelHeight - 1)) / 2,
            this.symbolSize * this.reelWidth,
            this.symbolSize * (this.reelHeight - 1)
        );

        // displayedSymbols 2D array
        for (let y = 0; y < this.reelHeight +1; y++) {
            this.displayedSymbols[y] = [];
        }

        // create reels, fill with symbols
        for (let x = 0; x < this.reelWidth; x++) {
            const reelContainer = this.add.container(
                centerX - (this.reelWidth / 2 - x) * this.symbolSize + 38,
                centerY - (this.symbolSize * this.reelHeight) / 2
            );

            for (let y = 0; y < this.reelHeight; y++) {
                const symbol = this.add.image(
                    0,
                    y * this.symbolSize,
                    Phaser.Math.RND.pick(this.symbols)
                );
                reelContainer.add(symbol);
            }

            // add reel container to the reels array
            this.reels.push(reelContainer);
        }

        // Set mask 
        const staticMask = new Phaser.Display.Masks.GeometryMask(this, this.mask);

        //static mask for each reel container
        this.reels.forEach(reel => {
            reel.setMask(staticMask);
        });

        this.spinButton = this.add.text(centerX, centerY + 200, 'Spin', {
            fontSize: '32px',
            backgroundColor: '#000',
            color: '#fff',
            padding: { x: 10, y: 10 },
        }).setInteractive({ useHandCursor: true }) 
        .on('pointerdown', () => this.startSpin())
    
        this.spinButton.setOrigin(0.5);
    
        this.resultText = this.add.text(centerX, centerY - 200, '', {
            fontSize: '32px',
            color: '#ff0000',
            align: 'center',
        }).setOrigin(0.5);
    
    }

     //-------------------------------------------//
   
    startSpin() {
        this.resultText.setText('');
        this.spinReels();
    }

    spinReels() {
        this.reels.forEach((reelContainer, reelIndex) => {
            const lastSymbol = reelContainer.list[reelContainer.list.length -1] as Phaser.GameObjects.Image;

            //create a tween....move the symbols down
            const tween = this.tweens.add({
                targets: reelContainer.list,
                y: `+=${this.symbolSize}`,
                duration: this.spinSpeed,
                ease: 'smooth',
                onComplete: () => {
                    

                    // if the symbol is off the bottom of the visible area
                    if (lastSymbol.y > this.symbolSize * (this.reelHeight-1)) {
                        //hidden symbol to top of the array
                        const newSymbol = this.add.image(
                            0,
                            this.symbolSize,
                            Phaser.Math.RND.pick(this.symbols)
                        );
                        reelContainer.addAt(newSymbol, 0);
                        reelContainer.remove(lastSymbol, true);
                        
                        

                        // ensure that symbols are displayed in the correct order
                        reelContainer.list.forEach((symbol: Phaser.GameObjects.Image, index: number) => {
                            symbol.y = index * this.symbolSize;
                        });
                        // Update the displayedSymbols array with the visible symbols
                        reelContainer.list
                            .slice(0, this.reelHeight-1) // Get only the visible symbols
                            .forEach((symbol, rowIndex) => {
                                this.displayedSymbols[rowIndex][reelIndex] = (symbol as Phaser.GameObjects.Image).texture.key;
                            });

                    }
                }
            });
        });

        // repeat tween for 8 repetitions
        if (this.spinDuration < 11) {
            this.spinDuration++;
            this.time.delayedCall(this.spinSpeed, this.startSpin, [], this);
        } else {
            this.spinDuration = 0;
            this.checkMatchingSymbols();
        }
    }




    
    checkMatchingSymbols() {
        // Iterate over the visible rows
        for (let row = 0; row < this.reelHeight -3 ; row++) { 
            const firstSymbol = this.displayedSymbols[row][0]; 
            const allSame = this.displayedSymbols[row].every(symbol => symbol === firstSymbol); // check if all symbols match
    
            if (allSame) {
                this.displayText('Bravo!', '#00ff00');
            } else {
                this.displayText('Skoraj!', '#00ff00');
            }
        }
    }

    displayText(message: string, color: string) {
        this.resultText.setText(message);  
        this.resultText.setColor(color);   
    }
}


//----------------------------//

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    scene: SlotMachineScene,
};
var game = new Phaser.Game(config);





