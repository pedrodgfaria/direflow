const fs = require('fs');
const { exec } = require('child_process');
const isWin = process.platform === "win32";

build('.');

if (!fs.existsSync('packages')) {
  return;
}

const widgetsDirectory = fs.readdirSync('packages');

for (let directory of widgetsDirectory) {
  if (fs.statSync(`packages/${directory}`).isDirectory()) {
    build(`packages/${directory}`);
  }
}

function build(dir) {
  console.log('Beginning to build:', dir);

  exec(`cd ${dir} && yarn build`, (err, out) => {
    if (err) {
      console.log(`✗ ${dir} could not build`);
      console.log(err);
      return;
    }

    if (dir === 'packages/direflow-component') {
      let mv = isWin ? `move` : `mv`;
      let path = `${dir}/dist/config/config-overrides.js ${dir}/config-overrides.js`;
      path = isWin ? path.replace(new RegExp('/', 'g'), '\\') : path;

      exec(`${mv} ${path}`, (err) => {
        if (err) {
          console.log(`✗ failed to move config-overrides.js`);
          console.log(err);
          return;
        }

        console.log(`✓ config-overrides.js moved succesfully`);
      })
    }
    
    console.log(`✓ ${dir} build succesfully`);
    out && console.log(out);
  });
}
