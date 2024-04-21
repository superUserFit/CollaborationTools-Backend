import { CreateRoom } from './requests/create-room.request';
import { DeleteRoom } from './requests/delete-room.request';

interface CreateRoomRequest extends CreateRoom {
    user_id: string;
}

interface DeleteRoomRequest extends DeleteRoom {
    user_id: string;
}

export {
    CreateRoomRequest,
    DeleteRoomRequest
}