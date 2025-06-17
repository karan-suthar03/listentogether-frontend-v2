import {io, Socket} from 'socket.io-client';

class SocketService {
    private socket: Socket | null = null;
    private readonly serverUrl = 'http://localhost:3000';
    private isConnecting = false;
    private connectionPromise: Promise<Socket> | null = null;

    connect(): Promise<Socket> {
        if (this.socket?.connected) {
            return Promise.resolve(this.socket);
        }

        if (this.isConnecting && this.connectionPromise) {
            return this.connectionPromise;
        }

        this.isConnecting = true;
        this.connectionPromise = new Promise((resolve, reject) => {
            if (this.socket && !this.socket.connected) {
                this.socket.removeAllListeners();
                this.socket.disconnect();
                this.socket = null;
            }

            this.socket = io(this.serverUrl, {
                transports: ['websocket', 'polling'],
                timeout: 5000,
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
                forceNew: false
            });

            const onConnect = () => {
                console.log('🔌 Connected to server with id:', this.socket?.id);
                this.isConnecting = false;
                this.socket?.off('connect', onConnect);
                this.socket?.off('connect_error', onError);
                resolve(this.socket!);
            };

            const onError = (error: Error) => {
                console.error('🔌 Connection error:', error);
                this.isConnecting = false;
                this.socket?.off('connect', onConnect);
                this.socket?.off('connect_error', onError);
                reject(error);
            };

            this.socket.on('connect', onConnect);
            this.socket.on('connect_error', onError);

            this.socket.on('disconnect', (reason: string) => {
                console.log('🔌 Disconnected from server:', reason);
                this.isConnecting = false;
            });

            this.socket.on('reconnect', (attemptNumber: number) => {
                console.log('🔌 Reconnected after', attemptNumber, 'attempts');
            });

            this.socket.on('reconnect_error', (error: Error) => {
                console.error('🔌 Reconnection error:', error);
            });
        });

        return this.connectionPromise;
    }

    disconnect(): void {
        if (this.socket) {
            console.log('🔌 Manually disconnecting socket');
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
        }
        this.isConnecting = false;
        this.connectionPromise = null;
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    async joinRoom(roomCode: string, user?: { id: string; name: string }): Promise<void> {
        const socket = await this.connect();
        if (user) {
            socket.emit('join-room', {roomCode, user});
        } else {
            socket.emit('join-room', {
                roomCode,
                user: {
                    id: `guest-${Date.now()}`,
                    name: 'Guest'
                }
            });
        }
    }

    async leaveRoom(roomCode: string): Promise<void> {
        if (this.socket?.connected) {
            this.socket.emit('leave-room', {roomCode});
        }
    }

    async getParticipants(roomCode: string): Promise<void> {
        console.log('🔍 Requesting participants for room:', roomCode);
        const socket = await this.connect();
        socket.emit('get-participants', {roomCode});
    }

    async on(event: string, callback: (...args: any[]) => void): Promise<void> {
        const socket = await this.connect();
        socket.on(event, callback);
    }

    off(event: string, callback?: (...args: any[]) => void): void {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    async emit(event: string, data?: any): Promise<void> {
        const socket = await this.connect();
        socket.emit(event, data);
    }

    async onQueueUpdated(callback: (data: { queue: any[], currentTrackIndex: number }) => void): Promise<void> {
        const socket = await this.connect();
        socket.on('queueUpdated', callback);
    }

    async onMusicState(callback: (syncData: any) => void): Promise<void> {
        const socket = await this.connect();
        socket.on('music-state', callback);
    }

    async onQueueItemProgress(callback: (data: {
        queueItemId: string,
        progress: number,
        status: string
    }) => void): Promise<void> {
        const socket = await this.connect();
        socket.on('queueItemProgress', callback);
    }

    async onQueueItemComplete(callback: (data: {
        queueItemId: string,
        mp3Url: string,
        status: string
    }) => void): Promise<void> {
        const socket = await this.connect();
        socket.on('queueItemComplete', callback);
    }

    async onQueueItemError(callback: (data: {
        queueItemId: string,
        error: string,
        status: string
    }) => void): Promise<void> {
        const socket = await this.connect();
        socket.on('queueItemError', callback);
    }

    async onParticipantList(callback: (participants: any[]) => void): Promise<void> {
        const socket = await this.connect();
        socket.on('participant-list', (participants: any[]) => {
            console.log('📋 Participant list event received:', participants);
            callback(participants);
        });
    }

    offQueueUpdated(): void {
        if (this.socket) {
            this.socket.off('queueUpdated');
        }
    }

    offMusicState(): void {
        if (this.socket) {
            this.socket.off('music-state');
        }
    }

    offQueueItemProgress(): void {
        if (this.socket) {
            this.socket.off('queueItemProgress');
        }
    }

    offQueueItemComplete(): void {
        if (this.socket) {
            this.socket.off('queueItemComplete');
        }
    }

    offQueueItemError(): void {
        if (this.socket) {
            this.socket.off('queueItemError');
        }
    }

    offParticipantList(): void {
        if (this.socket) {
            this.socket.off('participant-list');
        }
    }

    getSocket(): Socket | null {
        return this.socket;
    }
}

export const socketService = new SocketService();
export default socketService;
