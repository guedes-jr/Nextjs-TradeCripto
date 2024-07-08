export default class CandlePoint {
    x: Date;
    y: [number, number, number, number];

    constructor(openTime: string, open: string, high: string, low: string, close: string) {
        this.x = new Date(openTime);
        this.y = [parseFloat(open), parseFloat(high), parseFloat(low), parseFloat(close)];
    }

    getTime(): Date {
        return this.x;
    }

    getOpen(): number {
        return this.y[0];
    }

    getHigh(): number {
        return this.y[1];
    }

    getLow(): number {
        return this.y[2];
    }

    getClose(): number {
        return this.y[3];
    }
}
