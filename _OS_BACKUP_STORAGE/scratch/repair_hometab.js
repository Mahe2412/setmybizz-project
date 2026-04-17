const fs = require('fs');
const path = 'c:/Users/mahen/OneDrive/Desktop/setmybizz-project/components/os/HomeTab.tsx';
let content = fs.readFileSync(path, 'utf8').split('\n');

// The problematic area is around line 748 (index 747)
// We need to inject a </div> to match the opening at 670 and 674
content.splice(747, 1, '                            </div>', '                         </div>');

fs.writeFileSync(path, content.join('\n'), 'utf8');
console.log('File successfully repaired.');
