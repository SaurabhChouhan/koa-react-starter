import React, {Component} from 'react'
import {Route, Redirect} from 'react-router-dom'
import {NotificationContainer} from 'react-notifications'
import {AdminHomeContainer,
    SuperAdminHomeContainer,
    AppHomeContainer,
    HomeContainer,
    RegistrationFormContainer,
    ForgotPasswordFormContainer
} from '../containers'
import Header from './sections/Header'

class AppRouter extends Component {
    render() {
        return ([<NotificationContainer key="notification"/>,
                <Route key="home_route" exact path="/" render={(props) => {
                    console.log(this.props.loggedInUser)
                    if (this.props.isAuthenticated && this.props.loggedInUser) {
                        if (this.props.loggedInUser.isSuperAdmin)
                            return <Redirect to="/super-admin"/>
                        else if (this.props.loggedInUser.isAdmin)
                            return <Redirect to="/admin"/>
                        else if (this.props.loggedInUser.isAppUser)
                            return <Redirect to="/app-home"/>
                    }

                    return <HomeContainer/>

                }
                }/>,
                <Route key="super_admin_route" path="/super-admin" render={(props) => {
                    return <SuperAdminHomeContainer/>
                }
                }/>,
                <Route key="register-form" path="/register" render={(props) => {
                    if (this.props.isAuthenticated && this.props.loggedInUser) {
                        return <Redirect to="/"/>
                    }
                    return <RegistrationFormContainer/>
                }
                }/>,
                <Route key="forgot_password_route" path="/forgot-password" render={(props) => {
                    return [<Header {...props}/>, <div id="forgot-password"><ForgotPasswordFormContainer/></div>]
                }
                }/>,
                <Route key="admin_route" path="/admin" render={(props) => {
                    return <AdminHomeContainer/>
                }
                }/>,
                <Route key="app_home_route" path="/app-home" render={(props) => {
                    return <AppHomeContainer/>
                }
                }/>
            ]
        )
    }
}
export default AppRouter