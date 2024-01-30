export const extractCertificationNumber = (number: string) => {
    return parseInt(number.split("/")[0], 10);
};
