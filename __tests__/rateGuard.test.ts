import { checkRateLimit } from "@/lib/rateGuard";

describe("checkRateLimit", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("autorise le premier appel", () => {
    expect(checkRateLimit("rl-test-1", 3, 60_000)).toBe(true);
  });

  it("autorise jusqu'à maxCalls dans la fenêtre", () => {
    expect(checkRateLimit("rl-test-2", 3, 60_000)).toBe(true);
    expect(checkRateLimit("rl-test-2", 3, 60_000)).toBe(true);
    expect(checkRateLimit("rl-test-2", 3, 60_000)).toBe(true);
  });

  it("bloque au-delà de maxCalls", () => {
    checkRateLimit("rl-test-3", 2, 60_000);
    checkRateLimit("rl-test-3", 2, 60_000);
    expect(checkRateLimit("rl-test-3", 2, 60_000)).toBe(false);
  });

  it("reset après expiration de la fenêtre", () => {
    checkRateLimit("rl-test-4", 1, 60_000);
    expect(checkRateLimit("rl-test-4", 1, 60_000)).toBe(false);

    jest.advanceTimersByTime(60_001);
    expect(checkRateLimit("rl-test-4", 1, 60_000)).toBe(true);
  });
});
