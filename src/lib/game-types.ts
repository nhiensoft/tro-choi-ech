export const ROLES = ["Gen Z", "Nhà đầu tư", "Khách du lịch"] as const;
export type Role = (typeof ROLES)[number];

// Debate cycle: each role asks the next
export const DEBATE_CYCLE: { askerRole: Role; responderRole: Role }[] = [
  { askerRole: "Gen Z", responderRole: "Nhà đầu tư" },
  { askerRole: "Nhà đầu tư", responderRole: "Khách du lịch" },
  { askerRole: "Khách du lịch", responderRole: "Gen Z" },
];

export type GameStep =
  | "input"
  | "rules"
  | "role-pick"
  | "matchup-reveal"
  | "round-1-ask"
  | "round-1-respond"
  | "round-2-ask"
  | "round-2-respond"
  | "round-3-ask"
  | "round-3-respond"
  | "completion"
  | "scoring"
  | "awards-3rd"
  | "awards-2nd"
  | "awards-1st";

export interface RoundInfo {
  roundNumber: number;
  askerIdx: number;
  responderIdx: number;
  askerRole: Role;
  responderRole: Role;
}

export interface GameState {
  teams: [string, string, string];
  pickOrder: [number, number, number];
  roles: Record<number, Role>;
  remainingRoles: Role[];
  boxRoles: [Role, Role, Role]; // fixed mapping: box index → role (set once, never changes)
  step: GameStep;
  currentPickerIdx: number;
  // Timer
  timerStartedAt: number | null;
  timerDuration: number | null; // seconds
  // Scoring & awards
  scores: Record<number, number>;
  teamPhotos: Record<number, string>;
  awardsOrder: [number, number, number] | null; // [1st, 2nd, 3rd]
}

/** Compute 3 rounds from role assignments */
export function getRounds(roles: Record<number, Role>): RoundInfo[] {
  return DEBATE_CYCLE.map(({ askerRole, responderRole }, i) => {
    const askerIdx = Number(
      Object.entries(roles).find(([, r]) => r === askerRole)?.[0] ?? 0
    );
    const responderIdx = Number(
      Object.entries(roles).find(([, r]) => r === responderRole)?.[0] ?? 0
    );
    return { roundNumber: i + 1, askerIdx, responderIdx, askerRole, responderRole };
  });
}

/** Parse a round step string like "round-1-ask" into { round, phase } */
export function parseRoundStep(step: GameStep): { round: number; phase: "ask" | "respond" } | null {
  const match = step.match(/^round-(\d)-(\w+)$/);
  if (!match) return null;
  return { round: Number(match[1]), phase: match[2] as "ask" | "respond" };
}

export type GameAction =
  | { type: "SET_TEAMS"; teams: [string, string, string]; pickOrder?: [number, number, number]; remainingRoles?: Role[] }
  | { type: "PICK_ROLE"; teamIdx: number; role: Role }
  | { type: "NEXT_PICKER" }
  | { type: "GO_TO_RULES" }
  | { type: "GO_TO_ROLE_PICK" }
  | { type: "GO_TO_MATCHUP" }
  | { type: "GO_TO_ROUND"; round: 1 | 2 | 3; phase: "ask" | "respond" }
  | { type: "START_TIMER"; duration: number }
  | { type: "STOP_TIMER" }
  | { type: "GO_TO_COMPLETION" }
  | { type: "GO_TO_SCORING" }
  | { type: "SET_SCORE"; teamIdx: number; score: number }
  | { type: "SET_PHOTO"; teamIdx: number; url: string }
  | { type: "SET_AWARDS"; order: [number, number, number] }
  | { type: "GO_TO_AWARDS"; place: "3rd" | "2nd" | "1st" }
  | { type: "PUBLISH_AWARDS"; scores: Record<number, number>; order: [number, number, number] }
  | { type: "RESET" };

export const initialState: GameState = {
  teams: ["", "", ""],
  pickOrder: [0, 1, 2],
  roles: {},
  remainingRoles: [...ROLES],
  boxRoles: [...ROLES] as [Role, Role, Role],
  step: "input",
  currentPickerIdx: 0,
  timerStartedAt: null,
  timerDuration: null,
  scores: {},
  teamPhotos: {},
  awardsOrder: null,
};
