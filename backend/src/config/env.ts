import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables FIRST, before validation
dotenv.config();

/**
 * Environment Variable Validation Schema
 * 
 * Validates all required environment variables at startup.
 * Fails fast with clear error messages if validation fails.
 */

const envSchema = z.object({
  // Server configuration
  PORT: z
    .string()
    .default('3001')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val < 65536, {
      message: 'PORT must be between 1 and 65535',
    }),
  
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  
  // Database configuration
  DATABASE_URL: z
    .string()
    .url({ message: 'DATABASE_URL must be a valid PostgreSQL connection URL' })
    .refine((url) => url.startsWith('postgresql://'), {
      message: 'DATABASE_URL must start with postgresql://',
    }),
  
  // CORS configuration
  ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .describe('Comma-separated list of allowed CORS origins'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables at application startup.
 * 
 * @throws {Error} If validation fails with detailed error message
 * @returns {Env} Validated and typed environment variables
 */
export function validateEnv(): Env {
  try {
    const env = envSchema.parse(process.env);
    console.log('✓ Environment variables validated successfully');
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues ?? [];
      const missingVars = issues.map((e) => `  - ${String(e.path.join('.'))}: ${e.message}`).join('\n');
      
      console.error('❌ Environment variable validation failed:\n' + missingVars);
      console.error('\nPlease check your .env file and ensure all required variables are set.');
      console.error('See .env.example for reference.\n');
      
      throw new Error('Environment validation failed');
    }
    // Re-throw any other errors
    console.error('Unexpected error during environment validation:', error);
    throw error;
  }
}

/**
 * Global environment configuration
 * Export validated env for use throughout the application
 */
export const env = validateEnv();
