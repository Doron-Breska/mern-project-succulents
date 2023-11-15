import { fireEvent, render, screen } from "@testing-library/react";
import SucculentCard from "../components/SucculetCard";
import { SetStateAction } from "react";
import { AuthContext, AuthContextType, User } from "../contexts/AuthContext"; // Adjust the import path as needed
function deleteSucculent(succulentId: string): void {
  throw new Error("Function not implemented.");
}
function setSucculents(value: SetStateAction<any>): void {
  throw new Error("Function not implemented.");
}

test("Front side of the crad shows initally", () => {
  render(
    <SucculentCard
      key={11}
      succulent={{
        _id: "1",
        species: "Epithelantha micromeris",
        owner: {
          _id: "645e51e44092c39d7bb3ca5d",
          email: "doron@email.com",
          username: "Doron2",
          avatar:
            "https://res.cloudinary.com/danq3q4qv/image/upload/v1684919752/avatars/coqtlfikmvghslaglt1j.jpg",
        },
        img: "https://res.cloudinary.com/danq3q4qv/image/upload/v1683903214/succulents/haru9opy10tc16gvxeyn.jpg",
        description: "test-test",
        city: "Berlin",
        likes: ["64612d1b1c9ab7d1dbdab917", "6464b37aeb674616090682f0"],
        Comments: [],
        createdAt: "2023-05-12T14:53:35.517Z",
        updatedAt: "2023-11-15T13:09:53.418Z",
        __v: 51,
      }}
      deleteSucculent={deleteSucculent}
      setSucculents={setSucculents}
    />
  );
  const frontCard = screen.queryByTestId("frontCard");
  expect(frontCard).toBeVisible();
});

test("back side of the crad NOT shows initally", () => {
  render(
    <SucculentCard
      key={11}
      succulent={{
        _id: "1",
        species: "Epithelantha micromeris",
        owner: {
          _id: "645e51e44092c39d7bb3ca5d",
          email: "doron@email.com",
          username: "Doron2",
          avatar:
            "https://res.cloudinary.com/danq3q4qv/image/upload/v1684919752/avatars/coqtlfikmvghslaglt1j.jpg",
        },
        img: "https://res.cloudinary.com/danq3q4qv/image/upload/v1683903214/succulents/haru9opy10tc16gvxeyn.jpg",
        description: "test-test",
        city: "Berlin",
        likes: ["64612d1b1c9ab7d1dbdab917", "6464b37aeb674616090682f0"],
        Comments: [],
        createdAt: "2023-05-12T14:53:35.517Z",
        updatedAt: "2023-11-15T13:09:53.418Z",
        __v: 51,
      }}
      deleteSucculent={deleteSucculent}
      setSucculents={setSucculents}
    />
  );
  // i could not do the same as the previous test here because
  // both side of the card are "visible" on the dom and i
  // play with visibilty via CSS therefore
  // i check the class that effect th css
  const cardDiv = screen.getByTestId("fullCard");
  expect(cardDiv).not.toHaveClass("flipped");
});

//for the following test i had to mock the authContext bcs i use a r
// ender condition in the real component that check both
// the succulent object itself + the user from the authContext
// {succulent.owner._id === userId && (<FaEdit data-testid="flipFrontToBack" className="succulent-card-btn" onClick={handleFlip}/>)}
test("having the class 'flipped' after clicking on the flipp icon", () => {
  const mockUser: User = {
    _id: "123", // This must match the owner's ID of the succulent - line 115
    email: "user@example.com",
    username: "TestUser",
    avatar: "avatar_url",
    succulents: [],
    role: "user",
  };

  // Mock functions for the context
  const mockSetUser = jest.fn();
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();
  const mockSetLoading = jest.fn();

  // Mock AuthContext
  const mockAuthContext: AuthContextType = {
    user: mockUser,
    setUser: mockSetUser,
    login: mockLogin,
    logout: mockLogout,
    loading: false,
    setLoading: mockSetLoading,
  };
  render(
    <AuthContext.Provider value={mockAuthContext}>
      <SucculentCard
        key={11}
        succulent={{
          _id: "1",
          species: "Epithelantha micromeris",
          owner: {
            _id: "123", //// this must match the id of the user - line 84
            email: "doron@email.com",
            username: "Doron2",
            avatar:
              "https://res.cloudinary.com/danq3q4qv/image/upload/v1684919752/avatars/coqtlfikmvghslaglt1j.jpg",
          },
          img: "https://res.cloudinary.com/danq3q4qv/image/upload/v1683903214/succulents/haru9opy10tc16gvxeyn.jpg",
          description: "test-test",
          city: "Berlin",
          likes: ["64612d1b1c9ab7d1dbdab917", "6464b37aeb674616090682f0"],
          Comments: [],
          createdAt: "2023-05-12T14:53:35.517Z",
          updatedAt: "2023-11-15T13:09:53.418Z",
          __v: 51,
        }}
        deleteSucculent={deleteSucculent}
        setSucculents={setSucculents}
      />
    </AuthContext.Provider>
  );

  const flipFrontToBackButton = screen.getByTestId("flipFrontToBack");
  fireEvent.click(flipFrontToBackButton);

  const cardDiv = screen.getByTestId("fullCard");
  expect(cardDiv).toHaveClass("flipped");
});
