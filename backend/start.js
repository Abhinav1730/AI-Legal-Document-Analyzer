#!/usr/bin/env node

// Set memory options before importing anything else
process.env.NODE_OPTIONS = '--max-old-space-size=8192 --expose-gc';

// Import and start the main application
import('./index.js').catch(console.error);
