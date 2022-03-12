export function todayPlus(plus: number): Date {
    const today = new Date();
    today.setDate(today.getDate() + plus);
    return today
}
export function todayPlusAsStr(plus: number): string {
    const today = todayPlus(plus);
    return today.toLocaleDateString();
}