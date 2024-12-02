import { connect } from '@/dbConfig/dbConfig'
import { sendOtpByEmail, sendOtpBySms } from '@/helpers/mailer';
import { NextRequest, NextResponse } from 'next/server'
import UserModel from '@/models/userModel'
import { isEmail } from '@/helpers/helpers';

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { emailOrMobile } = reqBody;

        if (!emailOrMobile) {
            return NextResponse.json(
                { error: 'emailOrMobile is required' },
                { status: 400 }
            );
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 3600000; // OTP expiry time: 1 hour

        const isEmailInput = isEmail(emailOrMobile);
        const queryKey = isEmailInput ? 'email' : 'number';

        let user = await UserModel.findOne({ [queryKey]: emailOrMobile });

        if (!user) {
            user = new UserModel({
                [queryKey]: emailOrMobile,
                otpVerification: otp,
                otpVerificationExpiry: otpExpiry,
            });
            await user.save();
        } else {
            user.otpVerification = otp;
            user.otpVerificationExpiry = otpExpiry;
            await user.save();
        }

        if (isEmailInput) {
            // await sendOtpByEmail(emailOrMobile, otp);
        } else {
            await sendOtpBySms(emailOrMobile, otp);
        }

        return NextResponse.json(
            { message: 'OTP sent successfully',otp:otp },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error in OTP generation:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

