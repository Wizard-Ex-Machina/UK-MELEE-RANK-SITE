import { getEvents } from "./controllers/start gg/getEvents";
import { main } from "./services/glicko/main";
import { matchesFromEvents } from "./services/matchesFromEvent";

const Pool = require("pg").Pool;
const pool = new Pool({
  database: "UK-MELEE-RANK",
  port: 5432,
});

main();
export { pool };
