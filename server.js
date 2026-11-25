const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const ENV_PATH = path.join(ROOT_DIR, '.env');

function loadEnv(filePath) {
    if (!fs.existsSync(filePath)) return;
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;
        const eqIdx = line.indexOf('=');
        if (eqIdx === -1) continue;
        const key = line.slice(0, eqIdx).trim();
        let val = line.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
        }
        if (!(key in process.env)) {
            process.env[key] = val;
        }
    }
}

loadEnv(ENV_PATH);

const PORT = Number(process.env.PORT) || 3000;

const TECH_IMAGE_TARGETS = [
    { key: 'bill-upload', file: 'assets/img/local/tech-bill-upload.jpg', query: 'receipt smartphone payment scan' },
    { key: 'qr-code', file: 'assets/img/local/tech-qr-code.jpg', query: 'qr code scan mobile' },
    { key: 'lucky-draw', file: 'assets/img/local/tech-lucky-draw.jpg', query: 'prize wheel celebration gift' },
    { key: 'punch-card', file: 'assets/img/local/tech-punch-card.jpg', query: 'coffee loyalty stamp card' },
    { key: 'scratch-card', file: 'assets/img/local/tech-scratch-card.jpg', query: 'gift card voucher surprise' }
];

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.ico': 'image/x-icon'
};

function requestJson(url, headers = {}) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 400) {
                    return reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
                }
                try {
                    resolve(JSON.parse(data));
                } catch (err) {
                    reject(err);
                }
            });
        }).on('error', reject);
    });
}

function downloadFile(url, destPath, redirects = 0) {
    return new Promise((resolve, reject) => {
        if (redirects > 5) return reject(new Error('Too many redirects'));
        https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                res.resume();
                return resolve(downloadFile(res.headers.location, destPath, redirects + 1));
            }
            if (res.statusCode >= 400) {
                res.resume();
                return reject(new Error(`Download failed with HTTP ${res.statusCode}`));
            }
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
            const file = fs.createWriteStream(destPath);
            res.pipe(file);
            file.on('finish', () => file.close(resolve));
            file.on('error', (err) => {
                fs.unlink(destPath, () => reject(err));
            });
        }).on('error', reject);
    });
}

async function fetchUnsplashImages({ force = false } = {}) {
    const accessKey = (process.env.UNSPLASH_ACCESS_KEY || '').trim();
    if (!accessKey) {
        return {
            ok: false,
            message: 'UNSPLASH_ACCESS_KEY is not set in .env. Add your key and run: node server.js --fetch',
            results: []
        };
    }

    const results = [];
    for (const target of TECH_IMAGE_TARGETS) {
        const destPath = path.join(ROOT_DIR, target.file);
        if (!force && fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
            results.push({ key: target.key, file: target.file, status: 'cached' });
            continue;
        }

        const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(target.query)}&per_page=1&orientation=squarish`;
        const json = await requestJson(apiUrl, {
            Authorization: `Client-ID ${accessKey}`,
            'Accept-Version': 'v1',
            'User-Agent': 'brand-store-server/1.0'
        });

        const photo = json.results && json.results[0];
        const imageUrl = photo && photo.urls && (photo.urls.regular || photo.urls.small);
        if (!imageUrl) {
            results.push({ key: target.key, file: target.file, status: 'not_found' });
            continue;
        }

        await downloadFile(imageUrl, destPath);
        results.push({ key: target.key, file: target.file, status: 'downloaded' });
    }

    return { ok: true, results };
}

function serveStatic(req, res) {
    const reqPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const relPath = reqPath === '/' ? 'brand-store.html' : reqPath.replace(/^\/+/, '');
    const safePath = path.normalize(path.join(ROOT_DIR, relPath));

    if (!safePath.startsWith(ROOT_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Forbidden');
    }

    fs.stat(safePath, (err, stat) => {
        if (err || !stat.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('Not found');
        }
        const ext = path.extname(safePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        fs.createReadStream(safePath).pipe(res);
    });
}

async function main() {
    const args = process.argv.slice(2);
    const shouldFetchOnly = args.includes('--fetch');
    const force = args.includes('--force');

    if (shouldFetchOnly) {
        const summary = await fetchUnsplashImages({ force });
        console.log(JSON.stringify(summary, null, 2));
        process.exit(summary.ok ? 0 : 1);
    }

    // Auto-fetch missing local images on startup if UNSPLASH_ACCESS_KEY is configured
    try {
        const summary = await fetchUnsplashImages({ force: false });
        if (!summary.ok) {
            console.log('[images]', summary.message);
        } else {
            console.log('[images]', summary.results.map((r) => `${r.key}:${r.status}`).join(', '));
        }
    } catch (err) {
        console.error('[images] Error fetching Unsplash images:', err.message);
    }

    const server = http.createServer(async (req, res) => {
        const urlPath = (req.url || '/').split('?')[0];
        if (urlPath === '/api/fetch-images') {
            try {
                const summary = await fetchUnsplashImages({ force: req.url.includes('force=1') });
                res.writeHead(summary.ok ? 200 : 400, { 'Content-Type': 'application/json; charset=utf-8' });
                return res.end(JSON.stringify(summary, null, 2));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                return res.end(JSON.stringify({ ok: false, error: err.message }));
            }
        }
        serveStatic(req, res);
    });

    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}/`);
    });
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
