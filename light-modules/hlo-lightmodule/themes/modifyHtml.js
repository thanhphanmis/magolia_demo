const path = require('path');
const fs = require('fs');

const outDir = path.join(__dirname, 'dist');

fs.existsSync(outDir) && fs.readdirSync(outDir).forEach(fn => {
    if (/\.html\s*$/.test(fn)) {
        const fp = path.join(outDir, fn);
        let s = fs.readFileSync(fp, 'utf8');
        s = s.replace(/(['"])..\/(assets|css|js)\//g, '$1$2/').replace(/(['"])\/([^\/'"]*\.html)(['"])/g, '$1$2$3');
        fs.writeFileSync(fp, s);
    }
});
