import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadConfig, getConfigPath } from '../src/config.js';
import * as fs from 'node:fs';

vi.mock('node:fs');

describe('Config', () => {
  const originalEnv = process.env;
  const originalArgv = process.argv;

  beforeEach(() => {
    vi.resetAllMocks();
    process.env = { ...originalEnv };
    process.argv = [...originalArgv];
    delete process.env.OUTLINE_BASE_URL;
    delete process.env.OUTLINE_API_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
    process.argv = originalArgv;
  });

  describe('loadConfig', () => {
    it('should load config from environment variables', () => {
      process.env.OUTLINE_BASE_URL = 'https://outline.example.com';
      process.env.OUTLINE_API_KEY = 'test-api-key';

      const config = loadConfig();

      expect(config.baseUrl).toBe('https://outline.example.com');
      expect(config.apiKey).toBe('test-api-key');
    });

    it('should normalize base URL by removing trailing slash', () => {
      process.env.OUTLINE_BASE_URL = 'https://outline.example.com/';
      process.env.OUTLINE_API_KEY = 'test-api-key';

      const config = loadConfig();

      expect(config.baseUrl).toBe('https://outline.example.com');
    });

    it('should throw error when base URL is missing', () => {
      process.env.OUTLINE_API_KEY = 'test-api-key';

      expect(() => loadConfig()).toThrow(
        'Missing Outline base URL. Set OUTLINE_BASE_URL environment variable or provide config file.'
      );
    });

    it('should throw error when API key is missing', () => {
      process.env.OUTLINE_BASE_URL = 'https://outline.example.com';

      expect(() => loadConfig()).toThrow(
        'Missing Outline API key. Set OUTLINE_API_KEY environment variable or provide config file.'
      );
    });

    it('should load config from file when provided', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify({
          outline: {
            baseUrl: 'https://file.example.com',
            apiKey: 'file-api-key',
          },
        })
      );

      const config = loadConfig('/path/to/config.json');

      expect(config.baseUrl).toBe('https://file.example.com');
      expect(config.apiKey).toBe('file-api-key');
    });

    it('should override environment variables with config file values', () => {
      process.env.OUTLINE_BASE_URL = 'https://env.example.com';
      process.env.OUTLINE_API_KEY = 'env-api-key';

      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify({
          outline: {
            baseUrl: 'https://file.example.com',
          },
        })
      );

      const config = loadConfig('/path/to/config.json');

      expect(config.baseUrl).toBe('https://file.example.com');
      expect(config.apiKey).toBe('env-api-key');
    });

    it('should throw error for invalid JSON in config file', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('invalid json');

      expect(() => loadConfig('/path/to/config.json')).toThrow(
        /Invalid JSON in config file/
      );
    });
  });

  describe('getConfigPath', () => {
    it('should return undefined when no --config flag is provided', () => {
      process.argv = ['node', 'script.js'];

      expect(getConfigPath()).toBeUndefined();
    });

    it('should return config path when --config flag is provided', () => {
      process.argv = ['node', 'script.js', '--config', '/path/to/config.json'];

      expect(getConfigPath()).toBe('/path/to/config.json');
    });

    it('should return undefined when --config flag has no value', () => {
      process.argv = ['node', 'script.js', '--config'];

      expect(getConfigPath()).toBeUndefined();
    });
  });
});
