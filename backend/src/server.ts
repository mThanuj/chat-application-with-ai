import app from "./app";
import { env } from "./config/Env";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
