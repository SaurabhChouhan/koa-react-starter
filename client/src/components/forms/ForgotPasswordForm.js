import {reduxForm, Field, Form} from 'redux-form'
import React from 'react'
import {email, passwordLength, required} from './validation'
import {renderLoginField, renderText, renderField } from "./fields";

let ForgotPasswordForm = (props) => {
    const passwordMatch = (value, values) => {
        return (value !== values.password) ? `both password field should be same` : undefined
    }
    const {handleSubmit, errorMsg} = props
    return <Form onSubmit={handleSubmit}>
        <div className="" style={{background: '#E7E7E7'}}>
            <div className="modal-body">
                {errorMsg &&
                <div style={{width: "100%", textAlign: "center"}}><span className="validation-error"
                                                                        style={{fontSize: '20px'}}>{errorMsg}</span>
                </div>}
                <div className="registrationDiv">
                    {props.forgotPasswordRequestInfo && props.forgotPasswordRequestInfo.forgotPasswordRequestStatus === true ?
                        [<Field name="email" component={renderLoginField} type="hidden"/>,
                            <Field name="otp" label={"OTP :"} placeholder={"Enter OTP"}
                                   component={renderText} validate={[required]}/>,
                            <Field name="password" label={"New Password :"} placeholder={"new Password"}
                                   validate={[passwordLength]}
                                   component={renderText} type="password"/>,
                            <Field name="confirmPassword" label="Confirm Password :"
                                   placeholder={"confirm Password"}
                                   validate={[passwordLength, passwordMatch]} component={renderField}
                                   type="password"/>
                        ]
                        :
                        <Field name="email" component={renderLoginField} label="Email :"
                               validate={[required, email]}/>
                    }
                </div>
            </div>
            <div className="modal-footer">
                <button type="submit" className="btn btn-custom">Submit</button>
            </div>
        </div>
    </Form>
}

ForgotPasswordForm = reduxForm({
    form: "ForgotPasswordForm"
})(ForgotPasswordForm)

export default ForgotPasswordForm