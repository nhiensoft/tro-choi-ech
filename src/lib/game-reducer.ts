import { type GameState, type GameAction, initialState } from "./game-types";

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_TEAMS": {
      return {
        ...initialState,
        teams: action.teams,
        pickOrder: action.pickOrder,
        remainingRoles: action.remainingRoles,
        step: "role-pick",
        currentPickerIdx: 0,
      };
    }

    case "PICK_ROLE": {
      return {
        ...state,
        roles: { ...state.roles, [action.teamIdx]: action.role },
        remainingRoles: state.remainingRoles.filter((r) => r !== action.role),
      };
    }

    case "NEXT_PICKER": {
      return {
        ...state,
        currentPickerIdx: state.currentPickerIdx + 1,
      };
    }

    case "GO_TO_DEBATE": {
      return {
        ...state,
        step: "debate-pick",
        currentPickerIdx: 0,
      };
    }

    case "PICK_DEBATE": {
      const { teamIdx, targetIdx } = action;
      const thirdIdx = [0, 1, 2].find(
        (i) => i !== teamIdx && i !== targetIdx
      )!;
      return {
        ...state,
        debates: {
          [teamIdx]: targetIdx,
          [targetIdx]: thirdIdx,
          [thirdIdx]: teamIdx,
        },
      };
    }

    case "GO_TO_RESULT": {
      return { ...state, step: "result" };
    }

    case "RESET": {
      return { ...initialState };
    }

    default:
      return state;
  }
}
