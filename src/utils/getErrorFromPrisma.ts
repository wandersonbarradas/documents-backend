export const getErrorFromPrisma = (error: any) => {
    switch (error.code) {
        case "P2002":
            if (
                error.meta.target.includes("number") &&
                error.meta.target.includes("document_type_id")
            ) {
                return "O número deste documento já existe!";
            }
            break;
        default:
            return false;
    }
};
