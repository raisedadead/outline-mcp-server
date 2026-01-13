import { readFileSync, existsSync } from 'node:fs';
export function loadConfig(configPath) {
    // Start with environment variables
    let baseUrl = process.env.OUTLINE_BASE_URL;
    let apiKey = process.env.OUTLINE_API_KEY;
    // Override with config file if provided
    if (configPath && existsSync(configPath)) {
        try {
            const fileContent = readFileSync(configPath, 'utf-8');
            const fileConfig = JSON.parse(fileContent);
            if (fileConfig.outline?.baseUrl) {
                baseUrl = fileConfig.outline.baseUrl;
            }
            if (fileConfig.outline?.apiKey) {
                apiKey = fileConfig.outline.apiKey;
            }
        }
        catch (error) {
            const nodeError = error;
            if (nodeError.code === 'ENOENT') {
                throw new Error(`Config file not found: ${configPath}`);
            }
            else if (error instanceof SyntaxError) {
                throw new Error(`Invalid JSON in config file ${configPath}: ${error.message}`);
            }
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to read config file ${configPath}: ${message}`);
        }
    }
    // Validate required fields
    if (!baseUrl) {
        throw new Error('Missing Outline base URL. Set OUTLINE_BASE_URL environment variable or provide config file.');
    }
    if (!apiKey) {
        throw new Error('Missing Outline API key. Set OUTLINE_API_KEY environment variable or provide config file.');
    }
    // Normalize base URL (remove trailing slash)
    baseUrl = baseUrl.replace(/\/+$/, '');
    return { baseUrl, apiKey };
}
export function getConfigPath() {
    // Check for --config flag in args
    const configIndex = process.argv.indexOf('--config');
    if (configIndex !== -1 && process.argv[configIndex + 1]) {
        return process.argv[configIndex + 1];
    }
    return undefined;
}
//# sourceMappingURL=config.js.map