export class SecureStorageService {
    private static readonly USER_KEY = 'listentogether_session';

    static storeUserSession(userId: string, userName: string, roomCode: string): void {
        try {
            const sessionData = {
                userId,
                userName,
                roomCode,
                timestamp: Date.now()
            };
            localStorage.setItem(this.USER_KEY, JSON.stringify(sessionData));
        } catch (error) {
            console.error('Error storing user session:', error);
        }
    }

    static getUserSession(): { userId: string; userName: string; roomCode: string; timestamp: number } | null {
        try {
            const stored = localStorage.getItem(this.USER_KEY);
            if (!stored) return null;

            const sessionData = JSON.parse(stored);

            if (!sessionData.userId || !sessionData.userName || !sessionData.roomCode || !sessionData.timestamp) {
                this.clearUserSession();
                return null;
            }

            const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
            if (Date.now() - sessionData.timestamp > TWENTY_FOUR_HOURS) {
                this.clearUserSession();
                return null;
            }

            return sessionData;
        } catch (error) {
            console.error('Error reading user session:', error);
            this.clearUserSession();
            return null;
        }
    }

    static clearUserSession(): void {
        try {
            localStorage.removeItem(this.USER_KEY);
        } catch (error) {
            console.error('Error clearing user session:', error);
        }
    }

    static hasValidSession(roomCode: string): boolean {
        const session = this.getUserSession();
        return session !== null && session.roomCode === roomCode;
    }

    static updateRoomCode(newRoomCode: string): boolean {
        const session = this.getUserSession();
        if (session) {
            this.storeUserSession(session.userId, session.userName, newRoomCode);
            return true;
        }
        return false;
    }
}

export default SecureStorageService;
