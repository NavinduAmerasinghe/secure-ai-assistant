import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockUseAuth = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
  };
});

import ProtectedRoute from "../components/ProtectedRoute";

describe("ProtectedRoute", () => {
  it("shows a loading message while auth state is initializing", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });

    render(
      <ProtectedRoute>
        <div>Secret content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects unauthenticated users to the login page", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    render(
      <ProtectedRoute>
        <div>Secret content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByTestId("navigate")).toHaveAttribute("data-to", "/login");
  });

  it("renders protected children for authenticated users", () => {
    mockUseAuth.mockReturnValue({ user: { username: "tester" }, loading: false });

    render(
      <ProtectedRoute>
        <div>Secret content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Secret content")).toBeInTheDocument();
  });
});