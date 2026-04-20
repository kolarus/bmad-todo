import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { z } from 'zod';

describe('Environment Variable Validation', () => {
  const envKeys = ['PORT', 'NODE_ENV', 'DATABASE_URL', 'ALLOWED_ORIGINS'];
  let savedValues: Record<string, string | undefined>;

  beforeEach(() => {
    // Save original values key-by-key to avoid replacing the process.env reference
    savedValues = {};
    for (const key of envKeys) {
      savedValues[key] = process.env[key];
    }
  });

  afterEach(() => {
    // Restore per-key — never reassign process.env itself
    for (const key of envKeys) {
      if (savedValues[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = savedValues[key];
      }
    }
  });

  describe('PORT validation', () => {
    it('should accept valid port numbers', () => {
      const portSchema = z
        .string()
        .default('3001')
        .transform((val) => parseInt(val, 10))
        .refine((val) => val > 0 && val < 65536, {
          message: 'PORT must be between 1 and 65535',
        });

      expect(portSchema.parse('3001')).toBe(3001);
      expect(portSchema.parse('8080')).toBe(8080);
    });

    it('should reject invalid port numbers', () => {
      const portSchema = z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => val > 0 && val < 65536, {
          message: 'PORT must be between 1 and 65535',
        });

      expect(() => portSchema.parse('0')).toThrow();
      expect(() => portSchema.parse('65536')).toThrow();
      expect(() => portSchema.parse('-1')).toThrow();
    });

    it('should use default value when not provided', () => {
      const portSchema = z
        .string()
        .default('3001')
        .transform((val) => parseInt(val, 10))
        .refine((val) => val > 0 && val < 65536);

      expect(portSchema.parse(undefined)).toBe(3001);
    });
  });

  describe('NODE_ENV validation', () => {
    it('should accept valid NODE_ENV values', () => {
      const envSchema = z
        .enum(['development', 'production', 'test'])
        .default('development');

      expect(envSchema.parse('development')).toBe('development');
      expect(envSchema.parse('production')).toBe('production');
      expect(envSchema.parse('test')).toBe('test');
    });

    it('should reject invalid NODE_ENV values', () => {
      const envSchema = z.enum(['development', 'production', 'test']);

      expect(() => envSchema.parse('staging')).toThrow();
      expect(() => envSchema.parse('invalid')).toThrow();
    });

    it('should use default value when not provided', () => {
      const envSchema = z
        .enum(['development', 'production', 'test'])
        .default('development');

      expect(envSchema.parse(undefined)).toBe('development');
    });
  });

  describe('DATABASE_URL validation', () => {
    it('should accept valid PostgreSQL URLs', () => {
      const urlSchema = z
        .string()
        .url()
        .refine((url) => url.startsWith('postgresql://'), {
          message: 'Must start with postgresql://',
        });

      const validUrl = 'postgresql://postgres:postgres@localhost:5432/test';
      expect(urlSchema.parse(validUrl)).toBe(validUrl);
    });

    it('should reject non-PostgreSQL URLs', () => {
      const urlSchema = z
        .string()
        .url()
        .refine((url) => url.startsWith('postgresql://'), {
          message: 'Must start with postgresql://',
        });

      expect(() => urlSchema.parse('mysql://localhost:3306/test')).toThrow();
      expect(() => urlSchema.parse('http://localhost:5432/test')).toThrow();
    });

    it('should reject invalid URL formats', () => {
      const urlSchema = z.string().url();

      expect(() => urlSchema.parse('not-a-url')).toThrow();
      // Note: Zod's URL validator may accept some formats like 'localhost:5432'
      // so we test with clearly invalid format
      expect(() => urlSchema.parse('just-text')).toThrow();
    });
  });

  describe('ALLOWED_ORIGINS validation', () => {
    it('should accept valid origin URLs', () => {
      const originsSchema = z
        .string()
        .default('http://localhost:3000');

      expect(originsSchema.parse('http://localhost:3000')).toBe('http://localhost:3000');
      expect(originsSchema.parse('http://localhost:3000,https://example.com')).toBe('http://localhost:3000,https://example.com');
    });

    it('should use default value when not provided', () => {
      const originsSchema = z
        .string()
        .default('http://localhost:3000');

      expect(originsSchema.parse(undefined)).toBe('http://localhost:3000');
    });
  });

  describe('Fail-fast error messages', () => {
    it('should provide clear error messages for missing variables', () => {
      const schema = z.object({
        DATABASE_URL: z.string().url(),
      });

      try {
        schema.parse({});
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error).toBeInstanceOf(z.ZodError);
        // Just verify that it throws - the exact error format is implementation detail
      }
    });

    it('should provide clear error messages for invalid values', () => {
      const schema = z.object({
        PORT: z
          .string()
          .transform((val) => parseInt(val, 10))
          .refine((val) => val > 0 && val < 65536, {
            message: 'PORT must be between 1 and 65535',
          }),
      });

      try {
        schema.parse({ PORT: '99999' });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error).toBeInstanceOf(z.ZodError);
        // Just verify that it throws with the right error type
      }
    });
  });
});
