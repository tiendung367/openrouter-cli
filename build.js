
import fs from 'fs-extra';
import path from 'path';
import JavaScriptObfuscator from 'javascript-obfuscator';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');
const binDir = path.join(rootDir, 'bin');
const distDir = path.join(rootDir, 'dist');

const obfuscationOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 1,
    debugProtection: false,
    debugProtectionInterval: 4000,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 5,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayEncoding: ['rc4'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 5,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 5,
    stringArrayWrappersType: 'function',
    stringArrayThreshold: 1,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
};

// Clean dist folder
if (fs.existsSync(distDir)) {
    fs.removeSync(distDir);
}
fs.ensureDirSync(path.join(distDir, 'src'));
fs.ensureDirSync(path.join(distDir, 'bin'));

function obfuscateFile(filePath, suffix = '') {
    const code = fs.readFileSync(filePath, 'utf-8');
    const obfuscationResult = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
    return obfuscationResult.getObfuscatedCode();
}

async function build() {
    console.log('🔄 Sratring build & obfuscation...');

    // 1. Process SRC files
    const srcFiles = fs.readdirSync(srcDir);
    for (const file of srcFiles) {
        if (file.endsWith('.js')) {
            console.log(`🔒 Obfuscating src/${file}...`);
            const obfuscated = obfuscateFile(path.join(srcDir, file));
            fs.writeFileSync(path.join(distDir, 'src', file), obfuscated);
        }
    }

    // 2. Process BIN file
    console.log(`🔒 Obfuscating bin/openrouter.js...`);
    let binCode = fs.readFileSync(path.join(binDir, 'openrouter.js'), 'utf-8');

    // Determine hashbang
    let hashbang = '#!/usr/bin/env node';
    if (binCode.startsWith('#!')) {
        const firstLineEnd = binCode.indexOf('\n');
        hashbang = binCode.substring(0, firstLineEnd);
        binCode = binCode.substring(firstLineEnd + 1);
    }

    // Obfuscate bin content
    const obfuscatedBin = JavaScriptObfuscator.obfuscate(binCode, obfuscationOptions).getObfuscatedCode();

    // Write back with hashbang
    const finalBin = `${hashbang}\n${obfuscatedBin}`;
    fs.writeFileSync(path.join(distDir, 'bin', 'openrouter.js'), finalBin);

    // Make executable (on unix)
    try {
        fs.chmodSync(path.join(distDir, 'bin', 'openrouter.js'), '755');
    } catch (e) { }

    // 3. Copy other files (README, package.json for structure if needed, but usually we just publish the root package.json)
    // Actually, we don't need to copy package.json to dist if we just point package.json to dist.

    // 3. Copy package.json to dist to preserve relative usage of readFileSync('../package.json')
    fs.copySync(path.join(rootDir, 'package.json'), path.join(distDir, 'package.json'));

    console.log('✅ Build complete! Files are in dist/');
}

build();
