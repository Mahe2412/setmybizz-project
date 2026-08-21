#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI Color Codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bgBlue: '\x1b[44m',
  bgRed: '\x1b[41m'
};

console.log(`${colors.bright}${colors.blue}╔════════════════════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.bright}${colors.blue}║                   ARKLE NEURAL MULTI-AGENT REVIEWER                    ║${colors.reset}`);
console.log(`${colors.bright}${colors.blue}║          Actively Protecting UI, Security & Responsive Layouts          ║${colors.reset}`);
console.log(`${colors.bright}${colors.blue}╚════════════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

// 1. Get Staged Files or Scan All (if --all is passed)
const args = process.argv.slice(2);
const scanAll = args.includes('--all');
let filesToScan = [];

try {
  if (scanAll) {
    console.log(`${colors.dim}Scanning entire codebase (HomeTab, WorkforceTab, APIs)...${colors.reset}`);
    filesToScan = getFilesRecursively(process.cwd());
  } else {
    console.log(`${colors.dim}Finding staged files via Git...${colors.reset}`);
    const output = execSync('git diff --name-only --cached', { encoding: 'utf-8' });
    filesToScan = output.split('\n').map(f => f.trim()).filter(f => f.length > 0 && fs.existsSync(f));
    
    if (filesToScan.length === 0) {
      console.log(`${colors.yellow}⚠️ No staged files found. Scanning unstaged modifications...${colors.reset}`);
      const unstaged = execSync('git diff --name-only', { encoding: 'utf-8' });
      filesToScan = unstaged.split('\n').map(f => f.trim()).filter(f => f.length > 0 && fs.existsSync(f));
    }
  }
} catch (e) {
  console.log(`${colors.red}Error executing Git command. Defaulting to general scan of components & APIs...${colors.reset}`);
  filesToScan = getFilesRecursively(path.join(process.cwd(), 'components'))
    .concat(getFilesRecursively(path.join(process.cwd(), 'app/api')));
}

// Filter relevant files (.ts, .tsx, .css)
filesToScan = filesToScan.filter(f => {
  const ext = path.extname(f);
  return (ext === '.ts' || ext === '.tsx' || ext === '.css') && !f.includes('node_modules') && !f.includes('.next');
});

if (filesToScan.length === 0) {
  console.log(`${colors.green}✔ No files to review. Arkle Operator idle.${colors.reset}\n`);
  process.exit(0);
}

console.log(`${colors.cyan}🔍 Scanning ${filesToScan.length} source file(s) for UI, Security & Mobile layouts...${colors.reset}\n`);

let totalIssues = 0;
let fileAudits = [];

filesToScan.forEach(file => {
  const code = fs.readFileSync(file, 'utf-8');
  const lines = code.split('\n');
  const relativePath = path.relative(process.cwd(), file);
  
  const audit = {
    file: relativePath,
    securityIssues: [],
    responsivenessIssues: [],
    mobileLayoutIssues: []
  };

  // Rule Audits
  const isApi = file.includes('app/api/') || file.includes('pages/api/');
  const isComponent = file.includes('components/') || file.includes('components/os/');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // --- AGENT 1: API SECURITY AUDITOR ---
    if (isApi) {
      // Check for raw SQL queries without parameterized placeholders
      if (line.includes('queryRaw') || line.includes('executeRaw')) {
        if (!line.includes('${') && line.includes('`')) {
          audit.securityIssues.push({
            lineNum,
            code: line.trim(),
            rule: 'PRISMA_RAW_INJECTION',
            desc: 'Potential raw SQL injection risk. Ensure variables are parameterized.'
          });
        }
      }
      // Check if params or body are destructured without validation checks
      if (line.includes('req.json()') || line.includes('req.nextUrl')) {
        // Look ahead / context check for validation patterns in the file
        const hasValidation = code.includes('zod') || code.includes('yup') || code.includes('if (!') || code.includes('.schema');
        if (!hasValidation) {
          audit.securityIssues.push({
            lineNum,
            code: line.trim(),
            rule: 'INPUT_VALIDATION_MISSING',
            desc: 'Receiving request payload without visible schema validation (Zod/Yup).'
          });
        }
      }
    }

    // --- AGENT 2: UI RESPONSIVENESS AUDITOR ---
    if (isComponent) {
      // Fixed width limits that overflow mobile viewports without responsive overrides
      const fixedWidthRegex = /w-\[(\d+)px\]/g;
      let match;
      while ((match = fixedWidthRegex.exec(line)) !== null) {
        const widthVal = parseInt(match[1], 10);
        if (widthVal > 340 && !line.includes('md:w-') && !line.includes('lg:w-') && !line.includes('sm:w-') && !line.includes('max-w-full')) {
          audit.responsivenessIssues.push({
            lineNum,
            code: line.trim(),
            rule: 'OVERFLOW_FIXED_WIDTH',
            desc: `Fixed width ${widthVal}px may break responsive layouts on smaller screens. Use max-w-full or media prefixes.`
          });
        }
      }

      // Check flex wrap wrappers
      if (line.includes('className') && line.includes('flex') && !line.includes('flex-wrap') && !line.includes('flex-col') && !line.includes('md:flex-row') && !line.includes('shrink-0')) {
        // Warn if it might be a container holding multiple child elements
        if (line.includes('gap-') || line.includes('justify-')) {
          audit.responsivenessIssues.push({
            lineNum,
            code: line.trim(),
            rule: 'FLEX_CONTAINER_NO_WRAP',
            desc: 'Flex row container without wrap rules might squish items. Consider flex-col md:flex-row or flex-wrap.'
          });
        }
      }
    }

    // --- AGENT 3: MOBILE-FIRST CARD AUDITOR ---
    if (isComponent) {
      // Large margins or padding on container cards
      if (line.includes('rounded-') && (line.includes('p-8') || line.includes('p-12') || line.includes('p-10')) && !line.includes('md:p-')) {
        audit.mobileLayoutIssues.push({
          lineNum,
          code: line.trim(),
          rule: 'LARGE_MOBILE_PADDING',
          desc: 'Large padding on cards shrinks usable screen area on mobile. Consider standardizing on p-4 md:p-8.'
        });
      }

      // Grid cols without mobile styling
      if (line.includes('grid-cols-') && !line.includes('grid-cols-1') && !line.includes('sm:grid-cols-') && !line.includes('md:grid-cols-')) {
        audit.mobileLayoutIssues.push({
          lineNum,
          code: line.trim(),
          rule: 'GRID_COLS_MOBILE_COMPRESSION',
          desc: 'Grid layout has fixed multiple columns. Set mobile to grid-cols-1 or grid-cols-2 first, then scale up.'
        });
      }
    }
  });

  // Track if any issues found
  const totalFileIssues = audit.securityIssues.length + audit.responsivenessIssues.length + audit.mobileLayoutIssues.length;
  if (totalFileIssues > 0) {
    fileAudits.push(audit);
    totalIssues += totalFileIssues;
  }
});

// 2. Scan API Route Security Checks (Special file-level context agent)
filesToScan.forEach(file => {
  if (file.includes('app/api/') || file.includes('pages/api/')) {
    const code = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(process.cwd(), file);
    
    // Check if the endpoint has session authentication checking
    const hasAuthCheck = code.includes('session') || code.includes('dbUser') || code.includes('useAuth') || code.includes('getServerSession') || code.includes('apiKey') || code.includes('jwt') || code.includes('verify');
    if (!hasAuthCheck && !file.includes('/api/auth/')) {
      const existingAudit = fileAudits.find(a => a.file === relativePath) || {
        file: relativePath,
        securityIssues: [],
        responsivenessIssues: [],
        mobileLayoutIssues: []
      };

      existingAudit.securityIssues.push({
        lineNum: 1,
        code: '[File Level Context Check]',
        rule: 'AUTH_GATE_MISSING',
        desc: 'Security Alert: No explicit authentication checks (session, verify, jwt) found in API route file.'
      });

      if (!fileAudits.some(a => a.file === relativePath)) {
        fileAudits.push(existingAudit);
      }
      totalIssues++;
    }
  }
});

// 3. Print Report
if (totalIssues > 0) {
  fileAudits.forEach(audit => {
    console.log(`${colors.bright}${colors.yellow}📁 File: ${audit.file}${colors.reset}`);
    
    if (audit.securityIssues.length > 0) {
      console.log(`  ${colors.bright}${colors.red}🔐 Security Audit Warnings:${colors.reset}`);
      audit.securityIssues.forEach(issue => {
        console.log(`    Line ${colors.cyan}${issue.lineNum}${colors.reset}: ${issue.desc}`);
        console.log(`      ${colors.dim}${issue.code}${colors.reset}`);
      });
    }

    if (audit.responsivenessIssues.length > 0) {
      console.log(`  ${colors.bright}${colors.magenta}📱 UI Responsiveness Audit Warnings:${colors.reset}`);
      audit.responsivenessIssues.forEach(issue => {
        console.log(`    Line ${colors.cyan}${issue.lineNum}${colors.reset}: ${issue.desc}`);
        console.log(`      ${colors.dim}${issue.code}${colors.reset}`);
      });
    }

    if (audit.mobileLayoutIssues.length > 0) {
      console.log(`  ${colors.bright}${colors.cyan}📐 Mobile-First Layout Warnings:${colors.reset}`);
      audit.mobileLayoutIssues.forEach(issue => {
        console.log(`    Line ${colors.cyan}${issue.lineNum}${colors.reset}: ${issue.desc}`);
        console.log(`      ${colors.dim}${issue.code}${colors.reset}`);
      });
    }
    console.log();
  });

  console.log(`${colors.bright}${colors.red}╔════════════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.red}   ARKLE DEPLOYMENT SHIELD TRIGGERED: ${totalIssues} warnings need your review.      ${colors.reset}`);
  console.log(`${colors.bright}${colors.red}╚════════════════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  // Set non-zero exit status for CI to protect builds, but allow local bypass for prompt flexibility
  process.exit(1);
} else {
  console.log(`${colors.bright}${colors.green}╔════════════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.green}   ARKLE DEPLOYMENT PASS: UI, Security & Card Layout audits passed!       ${colors.reset}`);
  console.log(`${colors.bright}${colors.green}╚════════════════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  process.exit(0);
}

// Helper: Get files recursively
function getFilesRecursively(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        results = results.concat(getFilesRecursively(fullPath));
      }
    } else {
      results.push(fullPath);
    }
  });
  return results;
}
