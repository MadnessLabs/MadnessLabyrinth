interface CharacterConfig {
    mapTileWidth: number,
    mapTileHeight: number,
    tileWidth: number,
    tileHeight: number
}

export class Character {
    config: CharacterConfig;
    delayMove: number = 700;
    dimensions: [number, number] = [30, 30];
    position: [number, number] = [45, 45];
    tileFrom: [number, number] = [1, 1];
    tileTo: [number, number] = [1, 1];
    timeMoved: number = 0;

    constructor(config: CharacterConfig) {
        this.config = config;
    }

    placeAt(x: number, y: number) {
        this.tileFrom = [x, y];
        this.tileTo = [x, y];
        this.position = [
            ((this.config.tileWidth * x) + ((this.config.tileWidth - this.dimensions[0]) / 2)),
            ((this.config.tileHeight * y) + (this.config.tileHeight - this.dimensions[1] / 2))
        ];
    }

    processMovement(t: number) {
        if (this.tileFrom[0] === this.tileTo[0] && this.tileFrom[1] === this.tileTo[1]) {
            return false;
        }

        if ((t - this.timeMoved) >= this.delayMove) {
            this.placeAt(this.tileTo[0], this.tileTo[1]);
        } else {
            this.position[0] = (this.tileFrom[0] * this.config.tileWidth)
                + ((this.config.tileWidth - this.dimensions[0]) / 2);
            this.position[1] = (this.tileFrom[1] * this.config.tileHeight)
                + ((this.config.tileHeight - this.dimensions[1]) / 2);

            if (this.tileTo[0] !== this.tileFrom[0]) {
                let diff = (this.config.tileWidth / this.delayMove) * (t - this.timeMoved);
                this.position[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff);
            }

            if (this.tileTo[1] !== this.tileFrom[1]) {
                let diff = (this.config.tileHeight / this.delayMove) * (t - this.timeMoved);
                this.position[1] += (this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff);
            }

            this.position[0] = Math.round(this.position[0]);
            this.position[1] = Math.round(this.position[1]);
        }

        return true;
    }

    toIndex(x: number, y: number) {
        return ((y * this.config.mapTileWidth) + x);
    }
}