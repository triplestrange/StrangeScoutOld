export class MatchData {
  constructor(
    public TeamNumber: string,
    public MatchNumber: string,
    public StartPosition: string,
    public AutoMovementLine: boolean,
    public AutoSwitchCubes: number,
    public AutoScaleCubes: number,
    public FailedAutoSwitchCubes: number,
    public FailedAutoScaleCubes: number,
    public AutoExchange: number,
    public TeleSwitchCubes: number,
    public TeleScaleCubes: number,
    public FailedTeleSwitchCubes: number,
    public FailedTeleScaleCubes: number,
    public TeleExchange: number,
    public EndPosition: string,
    public YellowCards: number,
    public RedCards: number,
    public Notes: string,
    public Timestamp: string
  ) { }
}
