interface Slots {
  id: string;
  players: Slot[];
}

interface Slot {
  id: number;
  entrant: string;
  score: number;
}

interface Match {
  eventID: number;
  startGGID: string;
  player1ID: number;
  player2ID: number;
  player1Score: number;
  player2Score: number;
}

function setTransformer(solts: Slots, eventID: number): Match {
  return {
    eventID,
    startGGID: solts.id,
    player1ID: solts.players[0].id,
    player2ID: solts.players[1].id,
    player1Score: solts.players[0].score,
    player2Score: solts.players[1].score,
  };
}

export { setTransformer, Match };
