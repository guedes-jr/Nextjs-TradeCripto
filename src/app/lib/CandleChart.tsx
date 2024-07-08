import CandlePoint from "./CandlePoint";

class CandleChart {
    candles: CandlePoint[];
    TICK_SIZE: number;

    constructor(arr: CandlePoint[], tickSize: number) {
        this.candles = arr;
        this.TICK_SIZE = tickSize;
    }

    highestPrice(): number {
        const orderedKlines = this.candles.sort((a, b) => a.getHigh() - b.getHigh());
        return orderedKlines[orderedKlines.length - 1].getHigh();
    }

    lowestPrice(): number {
        const orderedKlines = this.candles.sort((a, b) => a.getLow() - b.getLow());
        return orderedKlines[0].getLow();
    }

    getMedium(): number {
        const atl = this.lowestPrice();
        const ath = this.highestPrice();
        return ((ath - atl) / 2) + atl;
    }

    getTrendTick(grouped: Record<number, number>, total: number): { tick: number; count: number; total: number } {
        const tickArr = Object.keys(grouped).map(k => ({ tick: parseFloat(k), count: grouped[k] }));
        tickArr.sort((a, b) => a.count - b.count);
        return { ...tickArr[tickArr.length - 1], total };
    }

    getTicks(candle: CandlePoint): number {
        const priceOsc = candle.getHigh() - candle.getLow();
        return priceOsc * (1 / this.TICK_SIZE);
    }

    getGroupedTicks(grouped: Record<number, number>, candle: CandlePoint): Record<number, number> {
        const ticks = this.getTicks(candle);
        for (let i = 0; i < ticks; i++) {
            const tick = candle.getLow() + this.TICK_SIZE * i;
            if (grouped[tick]) grouped[tick]++;
            else grouped[tick] = 1;
        }
        return grouped;
    }

    findSupport(): { tick: number; count: number; total: number } {
        const medium = this.getMedium();
        const candles = this.candles.filter(candle => candle.getLow() < medium);
        let grouped: Record<number, number> = {};
        candles.forEach(candle => (grouped = this.getGroupedTicks(grouped, candle)));
        return this.getTrendTick(grouped, candles.length);
    }

    findResistance(): { tick: number; count: number; total: number } {
        const medium = this.getMedium();
        const candles = this.candles.filter(candle => candle.getHigh() > medium);
        let grouped: Record<number, number> = {};
        candles.forEach(candle => (grouped = this.getGroupedTicks(grouped, candle)));
        return this.getTrendTick(grouped, candles.length);
    }
}

export default CandleChart;
