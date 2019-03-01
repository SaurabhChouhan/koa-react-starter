import * as ACC from "../actions/actionConsts"
import {ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_APP_USER} from "../clientconstants";


let initialState = {
    loggedIn: undefined, // contains details of logged in user (if any) else undefined
    isAuthenticated: false,
    authenticationFailed: false,
    loginError: undefined,
    all: [],
    selected: {}
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACC.ADD_USERS:
            return Object.assign({}, state, {all: action.users})
        case ACC.ADD_USER:
            return Object.assign({}, state, {all: [...state.all, action.user]})
        case ACC.EDIT_USER:
            return Object.assign({}, state, {
                all: state.all.map(item => item._id === action.user._id ? action.user : item)
            })
        case ACC.DELETE_USER:
            return Object.assign({}, state, {all: state.all.filter(item => item._id !== action.userID)})
        case ACC.ADD_LOGIN_USER:
            if (action.user) {
                let isSuperAdmin = false
                let isAdmin = false
                let isAppUser = false
                if (action.user && Array.isArray(action.user.roles)) {
                    if (action.user.roles.findIndex(r => r.name === ROLE_SUPER_ADMIN) !== -1)
                        isSuperAdmin = true
                    if (action.user.roles.findIndex(r => r.name === ROLE_ADMIN) !== -1)
                        isAdmin = true
                    if (action.user.roles.findIndex(r => r.name === ROLE_APP_USER) !== -1)
                        isAppUser = true
                }

                return Object.assign({}, state, {
                    loggedIn: Object.assign({}, action.user, {isSuperAdmin, isAdmin, isAppUser}),
                    isAuthenticated: true,
                    loginError: undefined
                })
            } else
                return state
        case ACC.LOGIN_FAILED:
            return Object.assign({}, state, {
                isAuthenticated: false,
                loginError: action.error
            })

        case ACC.FORGOT_PASSWORD_REQUEST_INFO:
            return Object.assign({}, state, {forgotPasswordRequestInfo: action.forgetPasswordInfo})

        default:
            return state
    }
}

export default userReducer