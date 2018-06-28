export class PitData {
	constructor(
		public TeamNumber: string,
		public TeamName: string,
		public TeamLocation: string,
		public GroundClearance: string,
		public DriveTrain: string,
		public RobotWeight: string,
		public LeftStart: boolean,
		public CenterStart: boolean,
		public RightStart: boolean,
		public CubeMech: boolean,
		public GroundIntake: boolean,
		public Climber:boolean,
		public Baseline: boolean,
		public AutonomousSwitch: boolean,
		public AutonomousScale: boolean,
		public AutonomousExchange: boolean,
		public TeleopSwitch: boolean,
		public TeleopScale: boolean,
		public TeleopExchange: boolean,
		public Notes: string,
		public Timestamp: string
	) { }
}
