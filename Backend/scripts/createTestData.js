#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Creating test data for counselor dashboard...\n');

try {
  // Run the test data creation script
  const { stdout, stderr } = await execAsync(
    `node "${path.join(__dirname, '../sampleData/createCounselorDashboardTestData.js')}"`,
    { cwd: path.join(__dirname, '..') }
  );

  if (stdout) {
    console.log(stdout);
  }
  
  if (stderr) {
    console.error(stderr);
  }

  console.log('\n✅ Test data creation completed!');
} catch (error) {
  console.error('❌ Error running test data creation:', error.message);
  process.exit(1);
}
