import sharp from 'sharp';
import { rename } from 'fs/promises';
import { join } from 'path';

const src = 'public/images/atlaslogo.png'
const tmp = join('public/images', 'atlaslogo-tmp.png')

await sharp(src)
  .resize(120)
  .toFile(tmp)

await rename(tmp, src)
console.log('done');
