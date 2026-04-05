import { type GameState, type GameAction, initialState } from "./game-types";

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_TEAMS": {
      return {
        ...initialState,
        teams: action.teams,
        pickOrder: action.pickOrder,
        remainingRoles: action.remainingRoles,
        step: "rules",
        currentPickerIdx: 0,
      };
    }

    case "GO_TO_RULES":
      return { ...state, step: "rules" };

    case "GO_TO_ROLE_PICK":
      return { ...state, step: "role-pick", currentPickerIdx: 0 };

    case "PICK_ROLE": {
      return {
        ...state,
        roles: { ...state.roles, [action.teamIdx]: action.role },
        remainingRoles: state.remainingRoles.filter((r) => r !== action.role),
      };
    }

    case "NEXT_PICKER": {
      return { ...state, currentPickerIdx: state.currentPickerIdx + 1 };
    }

    case "GO_TO_MATCHUP": {
      return { ...state, step: "matchup-reveal", timerStartedAt: null, timerDuration: null };
    }

    case "GO_TO_ROUND": {
      const stepMap = {
        "1-ask": "round-1-ask",
        "1-respond": "round-1-respond",
        "2-ask": "round-2-ask",
        "2-respond": "round-2-respond",
        "3-ask": "round-3-ask",
        "3-respond": "round-3-respond",
      } as const;
      const key = `${action.round}-${action.phase}` as keyof typeof stepMap;
      return {
        ...state,
        step: stepMap[key],
        timerStartedAt: null,
        timerDuration: null,
      };
    }

    case "START_TIMER": {
      return {
        ...state,
        timerStartedAt: Date.now(),
        timerDuration: action.duration,
      };
    }

    case "STOP_TIMER": {
      return { ...state, timerStartedAt: null, timerDuration: null };
    }

    case "GO_TO_COMPLETION":
      return { ...state, step: "completion", timerStartedAt: null, timerDuration: null };

    case "GO_TO_SCORING":
      return { ...state, step: "scoring" };

    case "SET_SCORE":
      return { ...state, scores: { ...state.scores, [action.teamIdx]: action.score } };

    case "SET_PHOTO":
      return { ...state, teamPhotos: { ...state.teamPhotos, [action.teamIdx]: action.url } };

    case "SET_AWARDS":
      return { ...state, awardsOrder: action.order };

    case "GO_TO_AWARDS": {
      const stepByPlace = { "3rd": "awards-3rd", "2nd": "awards-2nd", "1st": "awards-1st" } as const;
      return { ...state, step: stepByPlace[action.place] };
    }

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
}
