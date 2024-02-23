const Formatter = {
    number(number: string): string {
        const [pt1, pt2] = number.split("/");
        const paddedNumber = pt1.padStart(4, "0");
        return `${paddedNumber}/${pt2}`;
    },
    formatarDataPorExtenso(data: Date) {
        const meses = [
            "janeiro",
            "fevereiro",
            "março",
            "abril",
            "maio",
            "junho",
            "julho",
            "agosto",
            "setembro",
            "outubro",
            "novembro",
            "dezembro",
        ];

        const dia = data.getDate();
        const mes = meses[data.getMonth()];
        const ano = data.getFullYear();

        return `${dia < 10 ? "0" + dia : dia} de ${mes} de ${ano}`;
    },
};

export default Formatter;
