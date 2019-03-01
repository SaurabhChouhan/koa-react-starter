import {connect} from 'react-redux'
import {ForgotPasswordForm} from "../../components"
import {forgotPasswordRequest} from "../../actions"
import {NotificationManager} from "react-notifications"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (email) => dispatch(forgotPasswordRequest(email.email)).then((json) => {
        if (json.data) {
            NotificationManager.success('OTP has been sent on email.')
        } else {
            NotificationManager.error('Error in sending OTP!')
        }
    })
})

const mapStateToProps = (state, ownProps) => {
    return {
        errorMsg: state.user.forgotPasswordRequestInfo && state.user.forgotPasswordRequestInfo.forgotPasswordRequestStatus === false ? "Invalid Email Address" : null,
        forgotPasswordRequestInfo: state.user.forgotPasswordRequestInfo
    }
}

const ForgotPasswordFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPasswordForm)

export default ForgotPasswordFormContainer