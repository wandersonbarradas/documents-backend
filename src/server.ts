import "dotenv/config";
import app from "./app";

app.listen(process.env.PORT, () => {
    console.log("🚀 Running at PORT", process.env.PORT);
});
