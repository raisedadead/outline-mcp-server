const DEFAULT_PAGE_SIZE = 25;
const MAX_RETRIES = 3;
const MAX_PAGES = 100;
const INITIAL_RETRY_DELAY = 1000;
const RETRYABLE_STATUS_CODES = [429, 502, 503, 504];
export class OutlineClient {
    baseUrl;
    apiKey;
    constructor(config) {
        this.baseUrl = config.baseUrl;
        this.apiKey = config.apiKey;
    }
    async request(endpoint, body = {}, retries = MAX_RETRIES) {
        const url = `${this.baseUrl}/api/${endpoint}`;
        let response;
        try {
            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(body)
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Network error connecting to Outline API: ${message}`);
        }
        // Handle retryable errors
        if (RETRYABLE_STATUS_CODES.includes(response.status) && retries > 0) {
            const retryAfter = response.headers.get('Retry-After');
            const parsedRetryAfter = retryAfter ? parseInt(retryAfter, 10) : NaN;
            const delay = !isNaN(parsedRetryAfter)
                ? parsedRetryAfter * 1000
                : INITIAL_RETRY_DELAY * (MAX_RETRIES - retries + 1);
            await this.sleep(delay);
            return this.request(endpoint, body, retries - 1);
        }
        // Validate HTTP status before parsing
        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            try {
                const errorData = (await response.json());
                if (errorData.error) {
                    errorMessage = errorData.error;
                    if (errorData.message) {
                        errorMessage += ` - ${errorData.message}`;
                    }
                }
            }
            catch {
                // JSON parse failed, use status text
            }
            throw new Error(`Outline API error: ${errorMessage}`);
        }
        let data;
        try {
            data = (await response.json());
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Invalid JSON response from Outline API: ${message}`);
        }
        if (!data.ok) {
            const error = data;
            throw new Error(`Outline API error: ${error.error}${error.message ? ` - ${error.message}` : ''}`);
        }
        return data;
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async fetchAllPages(endpoint, params = {}, dataKey = 'data') {
        const allResults = [];
        let offset = 0;
        let hasMore = true;
        let pageCount = 0;
        while (hasMore && pageCount < MAX_PAGES) {
            pageCount++;
            const response = await this.request(endpoint, {
                ...params,
                limit: DEFAULT_PAGE_SIZE,
                offset
            });
            // Handle both array responses and object responses with nested data
            let items;
            if (Array.isArray(response.data)) {
                items = response.data;
            }
            else if (typeof response.data === 'object' &&
                response.data !== null &&
                dataKey in response.data) {
                const nested = response.data[dataKey];
                items = Array.isArray(nested) ? nested : [];
            }
            else {
                items = [];
            }
            allResults.push(...items);
            if (response.pagination?.nextPath && items.length > 0) {
                offset += DEFAULT_PAGE_SIZE;
            }
            else {
                hasMore = false;
            }
        }
        return allResults;
    }
    // Collection methods
    async listCollections() {
        return this.fetchAllPages('collections.list', {}, 'collections');
    }
    async getCollection(id) {
        const response = await this.request('collections.info', { id });
        return response.data;
    }
    // Document methods
    async listDocuments(params = {}) {
        return this.fetchAllPages('documents.list', { ...params }, 'documents');
    }
    async getDocument(id) {
        const response = await this.request('documents.info', { id });
        return response.data;
    }
    async searchDocuments(params) {
        return this.fetchAllPages('documents.search', { ...params }, 'results');
    }
    async createDocument(params) {
        const response = await this.request('documents.create', { ...params });
        return response.data;
    }
    async updateDocument(params) {
        const response = await this.request('documents.update', { ...params });
        return response.data;
    }
    async moveDocument(params) {
        const response = await this.request('documents.move', { ...params });
        return response.data.documents;
    }
}
//# sourceMappingURL=outline-client.js.map