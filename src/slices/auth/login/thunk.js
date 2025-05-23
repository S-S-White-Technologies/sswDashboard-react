//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
} from "../../../helpers/fakebackend_helper";
import api from "../../../config/api";
import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from './reducer';

// export const loginUser = (user, history) => async (dispatch) => {
//   try {
//     let response;

//     // ✅ MOCK LOGIN always (bypass all backend logic)
//     response = new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({
//           status: "success",
//           data: {
//             uid: 1,
//             email: user.empcode,
//             token: "mock-jwt-token",
//             name: "Demo User"
//           }
//         });
//       }, 500);
//     });

//     const data = await response;

//     if (data) {
//       sessionStorage.setItem("authUser", JSON.stringify(data));
//       dispatch(loginSuccess(data.data));
//       history("/dashboard");
//     }
//   } catch (error) {
//     dispatch(apiError(error));
//   }
// };

export const loginUser = (user, history) => async (dispatch) => {
  try {
    const response = await api.post("Auth/login", user);

    if (response.status === 200) {
      // store auth user in session
      sessionStorage.setItem("authUser", JSON.stringify(response.data));

      console.log("Whats the Data: ", response.data);

      // dispatch to redux
      dispatch(loginSuccess(response.data));

      // redirect to dashboard
      history("/dashboard");
    } else {
      dispatch(apiError("Invalid credentials."));
    }
  } catch (error) {
    const msg = error.response?.data || "Login failed!";
    console.log("Error is here:", msg);
    dispatch(apiError(msg));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    sessionStorage.removeItem("authUser");
    let fireBaseBackend = getFirebaseBackend();
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = fireBaseBackend.logout;
      dispatch(logoutUserSuccess(response));
    } else {
      dispatch(logoutUserSuccess(true));
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin = (type, history) => async (dispatch) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.socialLoginUser(type);
    }
    //  else {
    //   response = postSocialLogin(data);
    // }

    const socialdata = await response;
    if (socialdata) {
      sessionStorage.setItem("authUser", JSON.stringify(response));
      dispatch(loginSuccess(response));
      history('/dashboard')
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};