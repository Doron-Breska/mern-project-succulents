// import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SideBar from "../components/SideBar";
import { AuthContext, AuthContextType, User } from "../contexts/AuthContext"; // Adjust the import path as needed

test("SideBar shows after clicking on burgerBtn", async () => {
  render(
    //because i use "useLocation" inside this component i have to wrap it for the test
    //even though i dont test here anythig related to location...
    <BrowserRouter>
      <SideBar />
    </BrowserRouter>
  );
  const burgerBtn = screen.getAllByTestId("menu-button");
  fireEvent.click(burgerBtn[0]);

  const sideBar = await screen.findByTestId("sidebar");
  expect(sideBar).toBeVisible();
});

test("render link to 'profile' after successful login", async () => {
  // Mock user object mimics a typical user object that would be returned
  // from the backend to context after a successful login.
  const mockUser: User = {
    _id: "123",
    email: "email@email.com",
    username: "testuser",
    avatar: "avatar_url",
    succulents: [],
    role: "user",
  };

  // State to simulate the user state in the AuthContext
  let userState: User | null = null;

  // Mock functions for the context
  const mockSetUser = jest.fn((user: User | null) => {
    userState = user;
  });
  const mockLogin = jest.fn(() => {
    mockSetUser(mockUser); //  Simulate successful login
  });
  const mockLogout = jest.fn();
  const mockSetLoading = jest.fn();

  // Function to get the current mock context value
  const getMockContextValue = (): AuthContextType => ({
    user: userState,
    setUser: mockSetUser,
    login: mockLogin,
    logout: mockLogout,
    loading: false,
    setLoading: mockSetLoading,
  });

  const { rerender } = render(
    <AuthContext.Provider value={getMockContextValue()}>
      <BrowserRouter>
        <SideBar />
      </BrowserRouter>
    </AuthContext.Provider>
  );

  // Simulate user actions
  const burgerBtn = screen.getAllByTestId("menu-button");
  fireEvent.click(burgerBtn[0]);
  const emailInput = screen.getByPlaceholderText("email");
  fireEvent.change(emailInput, { target: { value: "email@email.com" } });
  const passwordInput = screen.getByPlaceholderText("password");
  fireEvent.change(passwordInput, { target: { value: "password" } });
  const submitBtn = await screen.findByRole("button");

  // Simulate login and re-render
  fireEvent.click(submitBtn);
  rerender(
    <AuthContext.Provider value={getMockContextValue()}>
      <BrowserRouter>
        <SideBar />
      </BrowserRouter>
    </AuthContext.Provider>
  );

  // Wait for the expected outcome
  await waitFor(() => {
    const profileLink = screen.getByTestId("profile");
    expect(profileLink).toBeVisible();
  });
});

test("Link to profile NOT shows after clicking on burgerBtn without LOGIN", async () => {
  render(
    <BrowserRouter>
      <SideBar />
    </BrowserRouter>
  );
  const burgerBtn = screen.getAllByTestId("menu-button");
  fireEvent.click(burgerBtn[0]);

  const profileLink = screen.queryByTestId("profile");
  expect(profileLink).not.toBeInTheDocument();
});
