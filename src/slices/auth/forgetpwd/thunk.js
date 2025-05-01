import { userForgetPasswordSuccess, userForgetPasswordError } from "./reducer"
import api from "../../../config/api";
//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";

import {
    postFakeForgetPwd,
    postJwtForgetPwd,
} from "../../../helpers/fakebackend_helper";

const fireBaseBackend = getFirebaseBackend();

export const userForgetPassword = (user, history) => async (dispatch) => {
    try {
        const response = await api.post("Auth/forgot-password", {
            email: user.email,
        });

        if (response.status === 200) {
            dispatch(userForgetPasswordSuccess("Reset link sent successfully."));
        } else {
            dispatch(userForgetPasswordError("Failed to send reset link."));
        }
    } catch (error) {
        dispatch(userForgetPasswordError(error?.response?.data || "Something went wrong."));
    }
}