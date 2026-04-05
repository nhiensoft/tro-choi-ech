export const ROLES = ["Gen Z", "Nhà đầu tư", "Khách du lịch"] as const;
export type Role = (typeof ROLES)[number];

export type GameStep =
  | "input"
  | "role-pick"
  | "debate-pick"
  | "result";

export interface GameState {
  teams: [string, string, string];
  pickOrder: [number, number, number];
  roles: Record<number, Role>;
  debates: Record<number, number>;
  remainingRoles: Role[];
  step: GameStep;
  currentPickerIdx: number;
}

export type GameAction =
  | { type: "SET_TEAMS"; teams: [string, string, string]; pickOrder: [number, number, number]; remainingRoles: Role[] }
  | { type: "PICK_ROLE"; teamIdx: number; role: Role }
  | { type: "NEXT_PICKER" }
  | { type: "GO_TO_DEBATE" }
  | { type: "PICK_DEBATE"; teamIdx: number; targetIdx: number }
  | { type: "GO_TO_RESULT" }
  | { type: "RESET" };

export const initialState: GameState = {
  teams: ["", "", ""],
  pickOrder: [0, 1, 2],
  roles: {},
  debates: {},
  remainingRoles: [...ROLES],
  step: "input",
  currentPickerIdx: 0,
};
