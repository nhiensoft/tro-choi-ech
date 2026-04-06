import "server-only";
import { kv } from "@vercel/kv";
import { gameReducer } from "./game-reducer";
import { type GameState, type GameAction, type Role, ROLES, initialState } from "./game-types";

const KV_KEY = "game-state";
const KV_VERSION_KEY = "game-version";

// === Helpers ===

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// === In-memory cache (per serverless invocation) ===

let cachedState: GameState | null = null;
let cachedVersion = 0;

async function loadState(forceRefresh = false): Promise<GameState> {
  if (cachedState && !forceRefresh) return cachedState;
  try {
    const stored = await kv.get<GameState>(KV_KEY);
    if (stored) {
      // Merge with initialState so new fields added later are never undefined
      cachedState = { ...initialState, ...stored };
      cachedVersion = (await kv.get<number>(KV_VERSION_KEY)) ?? 0;
      return cachedState;
    }
  } catch {
    // KV not available — use initial
  }
  cachedState = { ...initialState };
  cachedVersion = 0;
  return cachedState;
}

async function persistState(state: GameState, version: number) {
  try {
    await kv.set(KV_KEY, state);
    await kv.set(KV_VERSION_KEY, version);
  } catch {
    // KV not available — non-fatal
  }
}

// === Public API ===

export async function getState(forceRefresh = false): Promise<GameState> {
  return loadState(forceRefresh);
}

export function getVersion(): number {
  return cachedVersion;
}

export async function dispatch(action: GameAction): Promise<GameState> {
  // Always load fresh state from KV before dispatching
  await loadState(true);

  // For SET_TEAMS, pre-compute shuffled values (reducer must be pure)
  if (action.type === "SET_TEAMS") {
    const pickOrder = shuffle([0, 1, 2]) as [number, number, number];
    const remainingRoles = shuffle([...ROLES]) as Role[];
    action = { ...action, pickOrder, remainingRoles };
  }

  cachedState = gameReducer(cachedState!, action);
  cachedVersion++;
  await persistState(cachedState, cachedVersion);
  return cachedState;
}
