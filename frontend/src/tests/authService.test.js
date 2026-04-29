import { beforeEach, describe, expect, it, vi } from "vitest";

const mockApi = vi.hoisted(() => ({
  post: vi.fn(),
  get: vi.fn(),
}));

vi.mock("../services/api", () => ({
  default: mockApi,
}));

import { getCurrentUser, loginUser, registerUser } from "../services/authService";

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registerUser posts the payload and returns response data", async () => {
    mockApi.post.mockResolvedValueOnce({
      data: { message: "registered" },
    });

    const payload = {
      email: "test@example.com",
      username: "tester",
      password: "Password123!",
    };

    await expect(registerUser(payload)).resolves.toEqual({ message: "registered" });
    expect(mockApi.post).toHaveBeenCalledWith("/auth/register", payload);
  });

  it("loginUser posts credentials and returns response data", async () => {
    mockApi.post.mockResolvedValueOnce({
      data: { access_token: "token-123" },
    });

    const payload = {
      username: "tester",
      password: "Password123!",
    };

    await expect(loginUser(payload)).resolves.toEqual({ access_token: "token-123" });
    expect(mockApi.post).toHaveBeenCalledWith("/auth/login", payload);
  });

  it("getCurrentUser fetches the current user profile", async () => {
    mockApi.get.mockResolvedValueOnce({
      data: { id: 1, username: "tester" },
    });

    await expect(getCurrentUser()).resolves.toEqual({ id: 1, username: "tester" });
    expect(mockApi.get).toHaveBeenCalledWith("/users/me");
  });
});