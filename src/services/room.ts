import {roomApi} from './api';
import socketService from './socket';
import SecureStorageService from './storage';

export interface User {
    id: string;
    name: string;
    isHost: boolean;
    joinedAt: number;
    isConnected: boolean;
}

export interface Room {
    code: string;
    hostId: string;
    members: User[];
    playback: any;
    isWorking: boolean;
    workingMessage: string;
    createdAt: number;
}

export interface RoomState {
    room: Room | null;
    currentUser: User | null;
    isConnected: boolean;
    error: string | null;
}

class RoomService {
    private listeners: ((state: RoomState) => void)[] = [];
    private state: RoomState = {
        room: null,
        currentUser: null,
        isConnected: false,
        error: null
    };

    subscribe(listener: (state: RoomState) => void) {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    getState(): RoomState {
        return {...this.state};
    }

    async createRoom(roomName: string, userName: string) {
        try {
            this.setState({error: null});
            const response = await roomApi.createRoom(roomName, userName) as { room: Room, user: User };

            this.setState({
                room: response.room,
                currentUser: response.user
            });

            SecureStorageService.storeUserSession(response.user.id, response.user.name, response.room.code);

            return response;
        } catch (error) {
            this.setState({error: error instanceof Error ? error.message : 'Failed to create room'});
            throw error;
        }
    }

    async joinRoom(roomCode: string, userName: string) {
        try {
            this.setState({error: null});
            const response = await roomApi.joinRoom(roomCode, userName) as { room: Room, user: User };

            this.setState({
                room: response.room,
                currentUser: response.user
            });

            SecureStorageService.storeUserSession(response.user.id, response.user.name, response.room.code);

            socketService.connect();
            socketService.joinRoom(roomCode, response.user);

            this.setupSocketListeners();

            return response;
        } catch (error) {
            this.setState({error: error instanceof Error ? error.message : 'Failed to join room'});
            throw error;
        }
    }

    leaveRoom() {
        if (this.state.room) {
            socketService.leaveRoom(this.state.room.code);
        }
        socketService.disconnect();

        SecureStorageService.clearUserSession();

        this.setState({
            room: null,
            currentUser: null,
            isConnected: false,
            error: null
        });
    }

    clearError() {
        this.setState({error: null});
    }

    async restoreSession(roomCode: string): Promise<{ success: boolean; roomNotFound?: boolean }> {
        try {
            const sessionData = SecureStorageService.getUserSession();

            if (!sessionData) {
                return {success: false};
            }

            if (sessionData.roomCode !== roomCode) {
                console.log(`🔄 Switching from room ${sessionData.roomCode} to ${roomCode}`);
                SecureStorageService.updateRoomCode(roomCode);
            }

            try {
                const response = await roomApi.joinRoom(roomCode, sessionData.userName) as { room: Room, user: User };

                this.setState({
                    room: response.room,
                    currentUser: response.user,
                    isConnected: false
                });

                SecureStorageService.storeUserSession(response.user.id, response.user.name, roomCode);

                socketService.connect();
                socketService.joinRoom(roomCode, response.user);

                this.setupSocketListeners();

                return {success: true};
            } catch (error: any) {
                console.error('restoreSession validation error:', error);
                const isRoomNotFound = error?.message?.toLowerCase().includes('room not found') ||
                    error?.message?.toLowerCase().includes('room does not exist') ||
                    error?.status === 404 ||
                    error?.statusCode === 404;

                console.log('Room not found check:', {
                    message: error?.message,
                    status: error?.status,
                    statusCode: error?.statusCode,
                    isRoomNotFound
                });

                SecureStorageService.clearUserSession();
                console.error('Session validation failed:', error);

                return {success: false, roomNotFound: isRoomNotFound};
            }
        } catch (error) {
            console.error('Failed to restore session:', error);
            return {success: false};
        }
    }

    async switchRoom(newRoomCode: string): Promise<boolean> {
        try {
            if (this.state.room) {
                socketService.leaveRoom(this.state.room.code);
            }

            const sessionData = SecureStorageService.getUserSession();
            if (!sessionData) {
                return false;
            }

            const response = await roomApi.joinRoom(newRoomCode, sessionData.userName) as { room: Room, user: User };

            this.setState({
                room: response.room,
                currentUser: response.user,
                isConnected: false
            });

            SecureStorageService.storeUserSession(response.user.id, response.user.name, newRoomCode);

            socketService.joinRoom(newRoomCode, response.user);

            return true;
        } catch (error) {
            console.error('Failed to switch room:', error);
            return false;
        }
    }

    private setState(newState: Partial<RoomState>) {
        this.state = {...this.state, ...newState};
        this.listeners.forEach(listener => listener(this.state));
    }

    private setupSocketListeners() {
        socketService.on('room-updated', (updatedRoom: Room) => {
            this.setState({room: updatedRoom});
        });

        socketService.on('user-joined', (data: { user: User, room: Room }) => {
            this.setState({room: data.room});
        });

        socketService.on('user-left', (data: { user: User, room: Room }) => {
            this.setState({room: data.room});
        });
        socketService.on('connect', () => {
            this.setState({isConnected: true});
            if (this.state.room) {
                socketService.getParticipants(this.state.room.code);
            }
        });

        socketService.on('disconnect', () => {
            this.setState({isConnected: false});
        });

        socketService.on('room-deleted', () => {
            this.setState({
                room: null,
                currentUser: null,
                isConnected: false,
                error: 'Room was deleted'
            });
        });
        socketService.onParticipantList((participants: User[]) => {
            console.log('📋 Room service received participant list:', participants);
            if (this.state.room) {
                this.setState({
                    room: {
                        ...this.state.room,
                        members: participants
                    }
                });
            }
        });
    }
}

export const roomService = new RoomService();
export default roomService;
