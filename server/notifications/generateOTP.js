
const generateNewOTP = async () => {
        let otp = null;
        try {
            otp = Math.floor(Math.random() * (900000)) + 100000;
        } catch (e) {
            otp = null;
            console.log("ERROR : for generate New OTP " + e);
        }
    console.log("Success : generated New OTP : " + otp);
    return otp
}


module.exports = {
    generateNewOTP
}