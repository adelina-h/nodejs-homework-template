const httpMocks = require("node-mocks-http");
const login = require("../controllers/users/login");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

jest.mock("../models/user");
jest.mock("jsonwebtoken");

describe("Login Controller", () => {
  it("should return 200, token and user object on succes", async () => {
    const fakeUser = {
      _id: "123",
      email: "test@example.com",
      password: "$2a$10$hashed",
      subscription: "starter",
    };
    User.findOne.mockResolvedValue(fakeUser);

    const bcrypt = require("bcryptjs");
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
    jwt.sign.mockReturnValue("mocked-jwt-token");

    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        email: "test@example.com",
        password: "123456",
      },
    });

    const res = httpMocks.createResponse();
    const next = jest.fn();

    await login(req, res, next);

    expect(res.statusCode).toBe(200);

    const data = res._getJSONData();

    expect(data.token).toBe("mocked-jwt-token");

    expect(data.user).toEqual({
      email: "test@example.com",
      subscription: "starter",
    });
  });

  it("should return 401 if password is incorrect", async () => {
    const fakeUser = {
      _id: "123",
      email: "test@example.com",
      password: "$2a$10$hashed",
      subscription: "starter",
    };

    User.findOne.mockResolvedValue(fakeUser);

    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        email: "test@example.com",
        password: "gresit",
      },
    });

    const res = httpMocks.createResponse();
    const next = jest.fn();

    await login(req, res, next);

    expect(res.statusCode).toBe(401);

    const data = res._getJSONData();
    expect(data.message).toBe("Email or password is wrong");
  });
});
