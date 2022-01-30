/**
 * Compares two arrays and returns any expected
 * elements that are not in the actual array
 */
export function getMissingArrayElements(actualArr: any[], expectedArr: any[]): any[] | null {
    const missingLinks: any[] = [];
    expectedArr.forEach(l => {
        if (!actualArr.includes(l)) {
            missingLinks.push(l)
        }
    });
    return missingLinks.length > 0 ? missingLinks : null;
}