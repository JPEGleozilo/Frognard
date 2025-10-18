export default class RoundManager {
  constructor(scene, roundDurationMs = 30000, maxRounds = 3) {
    this.scene = scene;
    this.roundDuration = roundDurationMs;
    this.maxRounds = maxRounds;
    this.currentRound = 0;
    this.isRunning = false;

    this.elapsed = 0; // acumulador interno
    this._lastTickSecond = null;
  }

  startAll() {
    this.currentRound = 0;
    this.startNextRound();
  }

  startNextRound() {
    this.currentRound += 1;
    if (this.currentRound > this.maxRounds) {
      this.finishAllRounds();
      return;
    }

    this.isRunning = true;
    this.elapsed = 0; // reinicia tiempo interno
    this._lastTickSecond = null;

    this.scene.events.emit("roundStart", { round: this.currentRound, maxRounds: this.maxRounds });
  }

  update(time, delta) {
    if (!this.isRunning) return;

    this.elapsed += delta; // acumula el tiempo que pasa en esta ronda
    const remainingMs = Math.max(0, this.roundDuration - this.elapsed);
    const remainingSec = Math.ceil(remainingMs / 1000);

    if (remainingSec !== this._lastTickSecond) {
      this._lastTickSecond = remainingSec;
      this.scene.events.emit("roundTick", { round: this.currentRound, seconds: remainingSec });
    }

    if (remainingMs <= 0) {
      this.endCurrentRound();
    }
  }

  endCurrentRound() {
  if (!this.isRunning) return;
  this.isRunning = false;
  this.scene.events.emit("roundEnd", { round: this.currentRound });

  // Dejamos que la escena decida cuándo continuar
  if (this.currentRound >= this.maxRounds) {
    this.scene.time.delayedCall(1000, () => this.finishAllRounds());
  }
}


  finishAllRounds() {
    this.isRunning = false;
    this.scene.events.emit("roundsComplete", { totalRounds: this.maxRounds });
  }
}
