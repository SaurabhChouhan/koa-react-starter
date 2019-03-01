import * as TemplateUtil from './templateUtil'
import EmailSendBySES from './emailSendSesUtil'
import * as CONSTANT from '../../serverconstants'
import TemplatesModel from '../../models/templatesModel'
import NotificationModel from '../../models/notificationModel'
import * as GetTextMessages from '../../textMessages'

import logger from '../../logger'

export const sendEmailNotification = async (toList, bodyTemplateName, subjectTemplateName, data) => {
    let emailBodyTemplate = await TemplatesModel.findOne({
        "name": bodyTemplateName
    })

    let emailSubjectTemplate = await TemplatesModel.findOne({
        "name": subjectTemplateName
    })

    if (emailBodyTemplate && emailSubjectTemplate) {
        let body = TemplateUtil.performTokenReplacement(emailBodyTemplate.body, data);
        let subject = TemplateUtil.performTokenReplacement(emailSubjectTemplate.body, data);
        // Not waiting for anything as error while sending notifications would just be noted
        EmailSendBySES.sendEmailByAWSsES(toList, subject, body).catch((e) => {
            logger.error("Problem sending email by AWS ", {e})
        })
    } else {
        logger.error("At least one of the templates with name [" + bodyTemplateName + ", " + subjectTemplateName + "] not found")
    }
}

//Send sendNotification
export const sendNotification = async (emailData, templateName) => {
    console.log("Please wait...")
    console.log("Email is sending.....")
    return new Promise(async (res, rej) => {
        let emailTemplate = await TemplatesModel.findOne({
            "templateName": templateName,
            "status": "Approved",
            "isDeleted": false
        })
        if (!emailTemplate) {
            console.log("Template not found in DB.")
            rej(false)
        } else {
            if (templateName == CONSTANT.OTP_TEMPLATE) {
                console.log("inside otp template")
                //Set template json
                let templateUpdateWithDataJson = {
                    userName: emailData.user.firstName + ' ' + emailData.user.lastName,
                    OTPMessage: GetTextMessages.getOTPmessage({otp: emailData.OTP}),
                    COPY_RIGHT_FOOTER_MESSAGE: CONSTANT.COPY_RIGHT_FOOTER_MESSAGE
                }

                //Template data replace method
                TemplateUtil.performTokenReplacement(emailTemplate,
                    templateUpdateWithDataJson).then(async welcomeEmailTemplate => {
                    let to = [emailData.user.email]
                    let subject = emailTemplate.templateSubject
                    let message = welcomeEmailTemplate
                    let sent_type = 'For OTP'

                    //set notification json
                    let notificationData = {
                        from: CONSTANT.APP_SELF_USER_AND_EMAIL_INFO,
                        to: emailData.user,
                        notificationSendBy: "Email",
                        notificationSubject: emailTemplate.templateSubject,
                        notificationType: "OTP",
                        notificationBody: welcomeEmailTemplate,
                        notificationBodyText: GetTextMessages.getOTPmessage({otp: emailData.OTP}),
                        status: "Pending"
                    }
                    //Save email notification into DB
                    let notificationObj = await NotificationModel.addNotification(notificationData)

                    //send Email request method to AWS SES
                    EmailSendBySES.sendEmailByAWSsES(to, subject, message, sent_type).then(async emailSendResult => {
                        console.log("OTP_TEMPLATE status = ", emailSendResult); // Success!
                        if (emailSendResult) {
                            await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Sent")
                            res(true)
                        } else {
                            await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Failed")
                            res(false)
                        }
                    }, async reason => {
                        await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Failed")
                        console.log("OTP_TEMPLATE ", reason); // Error!
                        rej(false)
                    });


                }, reason => {
                    console.log("OTP_TEMPLATE ", reason); // Error!
                    rej(false)
                });
            } else if (templateName == CONSTANT.RESET_PASSWORD_TEMPLATE) {

                //Set template json
                let templateUpdateWithDataJson = {
                    userName: emailData.user.firstName + ' ' + emailData.user.lastName,
                    resetPasswordMessage: GetTextMessages.getResetPasswordMessage(),
                    COPY_RIGHT_FOOTER_MESSAGE: CONSTANT.COPY_RIGHT_FOOTER_MESSAGE
                }

                //Template data replace method
                TemplateUtil.performTokenReplacement(emailTemplate,
                    templateUpdateWithDataJson).then(async welcomeEmailTemplate => {
                    let to = [emailData.user.email]
                    let subject = emailTemplate.templateSubject
                    let message = welcomeEmailTemplate
                    let sent_type = 'For reset password'

                    //set notification json
                    let notificationData = {
                        from: CONSTANT.APP_SELF_USER_AND_EMAIL_INFO,
                        to: emailData.user,
                        notificationSendBy: "Email",
                        notificationSubject: emailTemplate.templateSubject,
                        notificationType: "Reset-Password",
                        notificationBody: welcomeEmailTemplate,
                        notificationBodyText: GetTextMessages.getResetPasswordMessage(),
                        status: "Pending"
                    }
                    //Save email notification into DB
                    let notificationObj = await NotificationModel.addNotification(notificationData)

                    //send Email request method to AWS SES
                    EmailSendBySES.sendEmailByAWSsES(to, subject, message, sent_type).then(async emailSendResult => {
                        console.log("RESET_PASSWORD_TEMPLATE status = ", emailSendResult); // Success!
                        if (emailSendResult) {
                            await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Sent")
                            res(true)
                        } else {
                            await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Failed")
                            res(false)
                        }
                    }, async reason => {
                        await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Failed")
                        console.log("RESET_PASSWORD_TEMPLATE ", reason); // Error!
                        rej(false)
                    });


                }, reason => {
                    console.log("RESET_PASSWORD_TEMPLATE ", reason); // Error!
                    rej(false)
                });
            }
            else {
                console.log("Template not found in DB.")
                rej(false)
            }
        }//end of else
    })
}