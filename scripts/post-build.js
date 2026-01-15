const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

try {
    // Destination paths
    const standaloneDir = path.join(__dirname, '..', '.next', 'standalone');
    const nextStaticDest = path.join(standaloneDir, '.next', 'static');
    const publicDest = path.join(standaloneDir, 'public');

    // Source paths
    const nextStaticSrc = path.join(__dirname, '..', '.next', 'static');
    const publicSrc = path.join(__dirname, '..', 'public');

    console.log('Copying build artifacts to standalone directory...');

    // Copy .next/static
    if (fs.existsSync(nextStaticSrc)) {
        console.log('Copying .next/static...');
        copyDir(nextStaticSrc, nextStaticDest);
    } else {
        console.warn('Warning: .next/static not found');
    }

    // Copy public
    if (fs.existsSync(publicSrc)) {
        console.log('Copying public directory...');
        copyDir(publicSrc, publicDest);
    } else {
        console.warn('Warning: public directory not found');
    }

    console.log('Post-build copy complete.');
} catch (error) {
    console.error('Error during post-build copy:', error);
    process.exit(1);
}
