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

// === In-memory cache (fast reads within same serverless invocation) ===

let cachedState: GameState | null = null;
let cachedVersion = 0;

async function loadState(): Promise<GameState> {
  if (cachedState) return cachedState;
  try {
    const stored = await kv.get<GameState>(KV_KEY);
    if (stored) {
      cachedState = stored;
      cachedVersion = (await kv.get<number>(KV_VERSION_KEY)) ?? 0;
      return stored;
    }
  } catch {
    // KV not available (local dev without KV) — use initial
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

// === SSE clients ===

type SSEClient = {
  controller: ReadableStreamDefaultController;
  encoder: TextEncoder;
};

const clients = new Set<SSEClient>();

function broadcastState() {
  const payload = `data: ${JSON.stringify({ state: cachedState, version: cachedVersion })}\n\n`;
  for (const client of clients) {
    try {
      client.controller.enqueue(client.encoder.encode(payload));
    } catch {
      clients.delete(client);
    }
  }
}

// === Public API ===

export async function getState(): Promise<GameState> {
  return loadState();
}

export function getVersion(): number {
  return cachedVersion;
}

export async function dispatch(action: GameAction): Promise<GameState> {
  // Ensure state is loaded
  await loadState();

  // For SET_TEAMS, pre-compute shuffled values (reducer must be pure)
  if (action.type === "SET_TEAMS") {
    const pickOrder = shuffle([0, 1, 2]) as [number, number, number];
    const remainingRoles = shuffle([...ROLES]) as Role[];
    action = { ...action, pickOrder, remainingRoles };
  }

  cachedState = gameReducer(cachedState!, action);
  cachedVersion++;
  await persistState(cachedState, cachedVersion);
  broadcastState();
  return cachedState;
}

export async function addSSEClient(controller: ReadableStreamDefaultController): Promise<SSEClient> {
  const encoder = new TextEncoder();
  const client: SSEClient = { controller, encoder };
  clients.add(client);

  // Send current state immediately
  const state = await loadState();
  const payload = `data: ${JSON.stringify({ state, version: cachedVersion })}\n\n`;
  controller.enqueue(encoder.encode(payload));

  return client;
}

export function removeSSEClient(client: SSEClient) {
  clients.delete(client);
}
