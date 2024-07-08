class LinePoint {
    x: Date;
    y: number;

    constructor(timestamp: string, value: string) {
        this.x = new Date(timestamp);
        this.y = parseFloat(value);
    }
}

export default LinePoint;
