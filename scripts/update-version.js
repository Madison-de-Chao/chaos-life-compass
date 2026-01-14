#!/usr/bin/env node

/**
 * Version Update Script for CHANGELOG.md
 * 
 * Usage:
 *   node scripts/update-version.js <version> [--date <date>]
 * 
 * Examples:
 *   node scripts/update-version.js 2.1.0
 *   node scripts/update-version.js 2.1.0 --date 2026-01-20
 * 
 * This script:
 * 1. Updates [Unreleased] section to the new version with date
 * 2. Adds a new empty [Unreleased] section
 * 3. Optionally accepts a custom date (defaults to today)
 */

const fs = require('fs');
const path = require('path');

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function printUsage() {
  log('\n📋 Version Update Script for CHANGELOG.md', 'cyan');
  log('─'.repeat(50));
  log('\nUsage:', 'bold');
  log('  node scripts/update-version.js <version> [--date <date>]');
  log('\nExamples:', 'bold');
  log('  node scripts/update-version.js 2.1.0');
  log('  node scripts/update-version.js 2.1.0 --date 2026-01-20');
  log('\nOptions:', 'bold');
  log('  <version>     Semantic version number (e.g., 2.1.0)');
  log('  --date        Optional: Release date in YYYY-MM-DD format');
  log('                Defaults to today\'s date');
  log('');
}

function validateVersion(version) {
  const semverRegex = /^\d+\.\d+\.\d+$/;
  if (!semverRegex.test(version)) {
    log(`\n❌ Invalid version format: "${version}"`, 'red');
    log('   Version must follow semantic versioning (e.g., 2.1.0)', 'yellow');
    return false;
  }
  return true;
}

function validateDate(dateStr) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    log(`\n❌ Invalid date format: "${dateStr}"`, 'red');
    log('   Date must be in YYYY-MM-DD format', 'yellow');
    return false;
  }
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    log(`\n❌ Invalid date: "${dateStr}"`, 'red');
    return false;
  }
  
  return true;
}

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseArgs(args) {
  const result = {
    version: null,
    date: getToday(),
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--date' && args[i + 1]) {
      result.date = args[i + 1];
      i++; // Skip next arg
    } else if (args[i] === '--help' || args[i] === '-h') {
      printUsage();
      process.exit(0);
    } else if (!args[i].startsWith('-')) {
      result.version = args[i];
    }
  }

  return result;
}

function updateChangelog(version, date) {
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  
  // Check if CHANGELOG.md exists
  if (!fs.existsSync(changelogPath)) {
    log('\n❌ CHANGELOG.md not found in current directory', 'red');
    return false;
  }

  let content = fs.readFileSync(changelogPath, 'utf8');
  
  // Check if [Unreleased] section exists
  if (!content.includes('## [Unreleased]')) {
    log('\n❌ [Unreleased] section not found in CHANGELOG.md', 'red');
    return false;
  }

  // Check if version already exists
  if (content.includes(`## [${version}]`)) {
    log(`\n⚠️  Version ${version} already exists in CHANGELOG.md`, 'yellow');
    return false;
  }

  // Create new unreleased section
  const newUnreleasedSection = `## [Unreleased]

### Added

### Changed

### Fixed

### Deprecated

### Removed

### Security

---

`;

  // Replace [Unreleased] with the new version
  content = content.replace(
    /## \[Unreleased\]\n([\s\S]*?)(?=\n---|\n## \[)/,
    `${newUnreleasedSection}## [${version}] - ${date}\n$1`
  );

  // Write updated content
  fs.writeFileSync(changelogPath, content, 'utf8');
  
  return true;
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }

  const { version, date } = parseArgs(args);

  if (!version) {
    log('\n❌ Version number is required', 'red');
    printUsage();
    process.exit(1);
  }

  if (!validateVersion(version)) {
    process.exit(1);
  }

  if (!validateDate(date)) {
    process.exit(1);
  }

  log('\n🚀 Updating CHANGELOG.md...', 'cyan');
  log(`   Version: ${version}`, 'green');
  log(`   Date: ${date}`, 'green');

  if (updateChangelog(version, date)) {
    log('\n✅ CHANGELOG.md updated successfully!', 'green');
    log('\n📝 Next steps:', 'bold');
    log('   1. Review the changes in CHANGELOG.md');
    log('   2. Fill in the release notes for this version');
    log('   3. Commit and create a release tag');
    log(`      git tag -a v${version} -m "Release ${version}"`);
    log('');
  } else {
    log('\n❌ Failed to update CHANGELOG.md', 'red');
    process.exit(1);
  }
}

main();
