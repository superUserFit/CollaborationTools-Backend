import { LoginRequest } from './requests/login.request';
import { SignUpRequest } from './requests/signup.request';
import { UpdateProfile } from './requests/update-profile.request';

interface UpdateProfileRequest extends UpdateProfile {
    user_id: string;
}

export {
    LoginRequest,
    SignUpRequest,
    UpdateProfileRequest
}