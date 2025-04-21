//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeRegister,
  postJwtRegister,
} from "../../../helpers/fakebackend_helper";

// action
import {
  registerUserSuccessful,
  registerUserFailed,
  resetRegisterFlagChange,
  apiErrorChange
} from "./reducer";

// initialize relavant method of both Auth
const fireBaseBackend = getFirebaseBackend();

// Is user register successfull then direct plot user in redux.
export const registerUser = (user) => async (dispatch) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      response = fireBaseBackend.registerUser(user.email);
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      response = postJwtRegister('/post-jwt-register', user);
    } else if (process.env.REACT_APP_API_URL) {
      // 🔹 Inline Mock Validation Logic
      const errors = {};

      if (!user.email || user.email.trim() === "") {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(user.email)) {
        errors.email = "Email format is invalid";
      }

     

      if (Object.keys(errors).length > 0) {
        dispatch(registerUserFailed({ message: "error", errors }));
      } else {
        const data = {
          message: "success",
          user,
        };
        console.warn("Response: ", message);
        dispatch(registerUserSuccessful(data));
      }

      return; // Stop further execution
    }
  } catch (error) {
    dispatch(registerUserFailed(error));
  }
};


export const resetRegisterFlag = () => {
  try {
    const response = resetRegisterFlagChange();
    return response;
  } catch (error) {
    return error;
  }
};

export const apiError = () => {
  try {
    const response = apiErrorChange();
    return response;
  } catch (error) {
    return error;
  }
};