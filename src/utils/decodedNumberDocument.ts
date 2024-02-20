export const extractCertificationNumber = (number: string | null) => {
    if (number) {
        return parseInt(number.split("/")[0], 10);
    }
    return 0;
};
