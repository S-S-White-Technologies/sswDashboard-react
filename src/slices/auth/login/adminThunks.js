//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
} from "../../../helpers/fakebackend_helper";

import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from './reducer';

export const loginAdmin = (user, history) => async (dispatch) => {
  try {
    let response;

    // ✅ MOCK LOGIN always (bypass all backend logic)
    response = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: "success",
          data: {
            uid: 1,
            email: user.email,
            token: "mock-jwt-token",
            name: "Demo User"
          }
        });
      }, 500);
    });

    const data = await response;

    if (data) {
      sessionStorage.setItem("authUser", JSON.stringify(data));
      dispatch(loginSuccess(data.data));
      history("/register");
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};




