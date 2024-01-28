import fs from 'fs-extra';

fs.removeSync('./dev-dist');
console.log('Old dev-dist folder deleted...');
