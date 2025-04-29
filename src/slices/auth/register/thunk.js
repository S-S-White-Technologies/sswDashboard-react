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
    const response = await axios.post("https://localhost:7168/api/registration/add-employee", user);

    if (response.status === 200 || response.status === 201) {
      console.log("Register Response:", response.status);
      dispatch(registerUserSuccessful(response.data));
    } else {
      dispatch(registerUserFailed({ message: "Registration failed", data: response.data }));
    }
  } catch (error) {
    dispatch(registerUserFailed(error.response?.data || { message: "Unknown error" }));
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