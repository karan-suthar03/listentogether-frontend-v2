import {queueApi} from './api';
import socketService from './socket';
import type {QueueItem} from '../types';

export interface QueueData {
    queue: QueueItem[];
    currentTrackIndex: number;
}

class QueueService {
    private listeners: ((queueData: QueueData) => void)[] = [];
    private queueData: QueueData = {
        queue: [],
        currentTrackIndex: -1
    };
    private socketListenersSetup = false;

    subscribe(listener: (queueData: QueueData) => void) {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    getState(): QueueData {
        return {...this.queueData};
    }

    async getQueue(roomCode: string): Promise<QueueData> {
        try {
            const queueData = await queueApi.getQueue(roomCode) as QueueData;
            this.updateQueue(queueData);
            return queueData;
        } catch (error) {
            console.error('Failed to get queue:', error);
            throw error;
        }
    }

    async addSearchResultToQueue(roomCode: string, searchResult: any, user: {
        id: string;
        name: string
    }): Promise<void> {
        try {
            await queueApi.addSearchResultToQueue(roomCode, searchResult, user.name);
        } catch (error) {
            console.error('Failed to add to queue:', error);
            throw error;
        }
    }

    async removeFromQueue(roomCode: string, index: number): Promise<void> {
        try {
            await queueApi.removeFromQueue(roomCode, index);
        } catch (error) {
            console.error('Failed to remove from queue:', error);
            throw error;
        }
    }

    updateQueue(queueData: QueueData): void {
        if (queueData.queue && Array.isArray(queueData.queue)) {
            if (queueData.currentTrackIndex < 0 && queueData.queue.length > 0) {
                const currentQueue = this.queueData;
                if (currentQueue.currentTrackIndex >= 0 &&
                    currentQueue.currentTrackIndex < queueData.queue.length) {
                    queueData.currentTrackIndex = currentQueue.currentTrackIndex;
                }
            }

            this.setState({
                queue: queueData.queue,
                currentTrackIndex: queueData.currentTrackIndex
            });
        }
    }

    setupSocketListeners(): void {
        if (this.socketListenersSetup) {
            return;
        }

        socketService.onQueueUpdated((data) => {
            this.updateQueue({
                queue: data.queue,
                currentTrackIndex: data.currentTrackIndex
            });
        });

        socketService.onMusicState((syncData) => {
            if (syncData.queue && syncData.currentTrackIndex !== undefined) {
                this.updateQueue({
                    queue: syncData.queue.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        artist: item.artist,
                        duration: item.duration,
                        addedBy: item.addedBy,
                        addedAt: typeof item.addedAt === 'string' ? new Date(item.addedAt).getTime() : item.addedAt,
                        coverUrl: item.coverUrl || '',
                        thumbnail: item.thumbnail || item.coverUrl || '',
                        mp3Url: item.mp3Url || '',
                        youtubeUrl: item.youtubeUrl || '',
                        videoId: item.videoId || '',
                        source: item.source || 'youtube',
                        downloadStatus: item.downloadStatus || 'completed',
                        downloadProgress: item.downloadProgress || 100
                    })),
                    currentTrackIndex: syncData.currentTrackIndex
                });
            }
        });

        socketService.onQueueItemProgress((data) => {
            this.updateQueueItemProgress(data.queueItemId, data.progress, data.status);
        });

        socketService.onQueueItemComplete((data) => {
            this.updateQueueItemComplete(data.queueItemId, data.mp3Url, data.status);
        });

        socketService.onQueueItemError((data) => {
            this.updateQueueItemError(data.queueItemId, data.error, data.status);
        });

        this.socketListenersSetup = true;
    }

    cleanup(): void {
        socketService.offQueueUpdated();
        socketService.offMusicState();
        socketService.offQueueItemProgress();
        socketService.offQueueItemComplete();
        socketService.offQueueItemError();

        this.socketListenersSetup = false;
        this.listeners = [];
    }

    private setState(newQueueData: Partial<QueueData>) {
        this.queueData = {...this.queueData, ...newQueueData};
        this.listeners.forEach(listener => listener(this.queueData));
    }

    private updateQueueItemProgress(queueItemId: string, progress: number, status: string): void {
        const currentQueue = this.queueData;
        const queueItem = currentQueue.queue.find(item => item.id === queueItemId);

        if (queueItem) {
            queueItem.downloadProgress = progress;
            queueItem.downloadStatus = status as any;
            this.setState({...currentQueue});
        }
    }

    private updateQueueItemComplete(queueItemId: string, mp3Url: string, status: string): void {
        const currentQueue = this.queueData;
        const queueItem = currentQueue.queue.find(item => item.id === queueItemId);

        if (queueItem) {
            queueItem.mp3Url = mp3Url;
            queueItem.downloadStatus = status as any;
            queueItem.downloadProgress = 100;
            this.setState({...currentQueue});
        }
    }

    private updateQueueItemError(queueItemId: string, _error: string, status: string): void {
        const currentQueue = this.queueData;
        const queueItem = currentQueue.queue.find(item => item.id === queueItemId);

        if (queueItem) {
            queueItem.downloadStatus = status as any;
            queueItem.downloadProgress = 0;
            this.setState({...currentQueue});
        }
    }
}

export const queueService = new QueueService();
export default queueService;
