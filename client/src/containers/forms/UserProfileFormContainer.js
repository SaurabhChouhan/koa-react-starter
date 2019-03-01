import {connect} from 'react-redux'
import {updateUserSettingsOnServer} from "../../actions"
import {UserProfileForm} from "../../components"
import {NotificationManager} from "react-notifications"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit:(values)=>{
       return dispatch(updateUserSettingsOnServer(values)).then(json => {
            if(json.success){
                NotificationManager.success('User Profile Updated Successfully')
            }
            else{
                NotificationManager.error('User Profile Update Failed')
            }
        })
    }
})

const mapStateToProps = (state, ownProps) => ({
    loggedInUser: state.user.loggedIn
})

const UserProfileFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProfileForm)

export default UserProfileFormContainer