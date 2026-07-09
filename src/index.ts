import "dotenv/config";
import { createApp } from "./app";

const PORT = process.env.PORT || 4000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`🤝 Helping Hands API listening on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});
