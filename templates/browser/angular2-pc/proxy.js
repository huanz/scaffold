const fs = require('fs');
const path = require('path');

const basePath = path.join(process.cwd(), 'assets', 'data');

module.exports = {
    '**/*.json': {
        bypass: (req, res) => {
            const jsonPath = path.join(basePath, req.path);
            if (fs.existsSync(jsonPath)) {
                res.json(JSON.parse(fs.readFileSync(jsonPath, 'utf8')));
                res.end();
            }
        }
    }
};
