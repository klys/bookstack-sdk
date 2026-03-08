
/**
 * Internal class to handle API requests to BookStack.
 */
class APIClient {
    /**
     * @param {Object} config
     * @param {string} [config.apiHost] - Base URL of the BookStack instance.
     * @param {string} [config.apiKey] - API Token ID.
     * @param {string} [config.apiSecret] - API Token Secret.
     */
    constructor(config) {
        this.apiHost = config.apiHost || process.env.BOOKSTACK_API_HOST;
        this.apiKey = config.apiKey || process.env.BOOKSTACK_API_KEY || process.env.BOOSKTACK_API_KEY;
        this.apiSecret = config.apiSecret || process.env.BOOKSTACK_API_SECRET;

        if (!this.apiHost) throw new Error("BookStack API Host not configured");
        if (!this.apiKey) throw new Error("BookStack API Key not configured");
        if (!this.apiSecret) throw new Error("BookStack API Secret not configured");

        this.apiHost = this.apiHost.replace(/\/$/, '');
    }

    /**
     * Make a request to the BookStack API.
     * @param {string} endpoint - The API endpoint (e.g., 'books').
     * @param {string} [method='GET'] - HTTP method.
     * @param {Object} [data=null] - Request body data.
     * @returns {Promise<any>} JSON response.
     */
    async request(endpoint, method = 'GET', data = null) {
        const url = `${this.apiHost}/api/${endpoint}`;
        const headers = {
            'Authorization': `Token ${this.apiKey}:${this.apiSecret}`,
            'Content-Type': 'application/json'
        };

        const options = { method, headers };
        if (data) options.body = JSON.stringify(data);

        const response = await fetch(url, options);
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`BookStack API Error ${response.status}: ${text}`);
        }
        return response.json();
    }
}

/**
 * Generic resource class for handling CRUD operations on BookStack entities.
 */
class Resource {
    /**
     * @param {APIClient} client
     * @param {string} path - The API endpoint path for this resource (e.g., 'books').
     */
    constructor(client, path) {
        this.client = client;
        this.path = path;
    }

    /**
     * List items of this resource type.
     * @param {Object} [params] - Query parameters (e.g., { count: 5, sort: '-id', filter: 'name:value' }).
     * @returns {Promise<any>}
     */
    list(params) {
        let url = this.path;
        if (params) {
            const query = new URLSearchParams(params).toString();
            url += `?${query}`;
        }
        return this.client.request(url);
    }

    /**
     * Create a new item.
     * @param {Object} data - The data for the new item.
     * @returns {Promise<any>}
     */
    create(data) {
        return this.client.request(this.path, 'POST', data);
    }

    /**
     * Get a specific item by ID.
     * @param {number|string} id - The ID of the item.
     * @returns {Promise<any>}
     */
    read(id) {
        return this.client.request(`${this.path}/${id}`);
    }

    /**
     * Update an existing item.
     * @param {number|string} id - The ID of the item to update.
     * @param {Object} data - The data to update.
     * @returns {Promise<any>}
     */
    update(id, data) {
        return this.client.request(`${this.path}/${id}`, 'PUT', data);
    }

    /**
     * Delete an item.
     * @param {number|string} id - The ID of the item to delete.
     * @returns {Promise<any>}
     */
    delete(id) {
        return this.client.request(`${this.path}/${id}`, 'DELETE');
    }
}

/**
 * Main SDK class for interacting with the BookStack API.
 */
export default class BookstackSDK {
    /**
     * @param {Object} [config] - Configuration options.
     * @param {string} [config.apiHost] - Defaults to process.env.BOOKSTACK_API_HOST
     * @param {string} [config.apiKey] - Defaults to process.env.BOOKSTACK_API_KEY
     * @param {string} [config.apiSecret] - Defaults to process.env.BOOKSTACK_API_SECRET
     */
    constructor(config = {}) {
        this.client = new APIClient(config);
        
        this.book = new Resource(this.client, 'books');
        this.page = new Resource(this.client, 'pages');
        this.chapter = new Resource(this.client, 'chapters');
        this.shelf = new Resource(this.client, 'shelves');
        this.user = new Resource(this.client, 'users');
    }
}