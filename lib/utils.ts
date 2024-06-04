export function formatToTimeAge(date: string): string {
    const dayInMs = 1000 * 60 * 60 * 24;
    const time = new Date(date).getTime();
    const now = new Date().getTime();
    const diff = Math.round((time - now) / dayInMs);

    // Intl: 국제화 관련 API
    const formatter = new Intl.RelativeTimeFormat("ko");

    return formatter.format(diff, "days");
}

export function formatToWon(price: number): string {
    return price.toLocaleString("ko-KR");
}
