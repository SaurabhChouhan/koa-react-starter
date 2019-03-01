import compile from 'string-template/compile'
import * as CONSTANT from './serverconstants'

/*Basic email message*/
export const getWelcomeTemplateMessage = compile("Welcome To Application",true);
export const getOTPmessage = compile("Your Application OTP is  {otp}",true);
export const getResetPasswordMessage = compile("Your password has been reset successfully.",true);
