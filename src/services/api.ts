const API_BASE_URL = 'http://localhost:3000/api';

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);

        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            const errorMessage = `HTTP error! status: ${response.status}`;
            const error = new Error(errorMessage) as any;
            error.status = response.status;
            error.statusCode = response.status;
            throw error;
        }

        if (!response.ok) {
            const errorMessage = data.error || `HTTP error! status: ${response.status}`;
            const error = new Error(errorMessage) as any;
            error.status = response.status;
            error.statusCode = data.statusCode || response.status;
            console.error('API Error Response:', {status: response.status, data, errorMessage});
            throw error;
        }

        if (!data.success) {
            const error = new Error(data.error || 'API request failed') as any;
            error.status = response.status;
            error.statusCode = data.statusCode || response.status;
            console.error('API Failed Response:', {status: response.status, data});
            throw error;
        }

        return data.data;
    } catch (error) {
        console.error('API request failed:', {url, error});
        throw error;
    }
}

export interface SearchResult {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: string;
    thumbnail: string;
    youtubeUrl: string;
    viewCount?: number;
    uploadDate?: string;
}

export const searchApi = {
    async searchMusic(query: string, limit: number = 20): Promise<SearchResult[]> {
        const params = new URLSearchParams({
            query: query.trim(),
            limit: limit.toString(),
        });

        return apiRequest<SearchResult[]>(`/search?${params}`);
    },

    async getSuggestions(): Promise<string[]> {
        return apiRequest<string[]>('/search/suggestions');
    },
};

export const queueApi = {
    async addSearchResultToQueue(roomCode: string, searchResult: SearchResult, addedBy: string) {
        return apiRequest(`/queue/${roomCode}/add-search-result`, {
            method: 'POST',
            body: JSON.stringify({searchResult, addedBy}),
        });
    },

    async addToQueue(roomCode: string, songData: { youtubeUrl?: string; spotifyUrl?: string }, addedBy: string) {
        return apiRequest('/queue/' + roomCode + '/add', {
            method: 'POST',
            body: JSON.stringify({songData, addedBy}),
        });
    },
    async getQueue(roomCode: string) {
        return apiRequest('/queue/' + roomCode);
    },

    async removeFromQueue(roomCode: string, index: number) {
        return apiRequest('/queue/' + roomCode + '/' + index, {
            method: 'DELETE',
        });
    },
};

export const roomApi = {
    async createRoom(_roomName: string, username: string) {
        return apiRequest('/rooms', {
            method: 'POST',
            body: JSON.stringify({name: username}),
        });
    },

    async joinRoom(roomCode: string, username: string) {
        return apiRequest('/rooms/join', {
            method: 'POST',
            body: JSON.stringify({code: roomCode, name: username}),
        });
    },
};
