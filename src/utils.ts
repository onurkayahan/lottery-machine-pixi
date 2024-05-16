export function getLotteryBallImage(value: number) {
    return new URL(`./assets/lottery-balls/${value}.png`, import.meta.url).href;
}
