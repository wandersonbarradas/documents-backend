import z from "zod";

const schema = z.object({
    date: z.string().transform((date) => new Date(date)),
});

const inputData = {
    date: "2024-01-27T12:00:00.000Z", // Exemplo de string de data
};

try {
    const parsedData = schema.parse(inputData);
    console.log("🚀 ~ parsedData:", parsedData);
    console.log(parsedData.date instanceof Date);
} catch (error: any) {
    console.error(error.errors);
}
