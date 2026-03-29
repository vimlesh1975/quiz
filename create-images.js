const fs = require('fs');

for (let i = 1; i <= 10; i++) {
  const hue = i * 36;
  const svg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="hsl(${hue}, 70%, 60%)"/>
  <text x="200" y="150" font-size="48" fill="white" text-anchor="middle" dy=".3em">Image ${i}</text>
</svg>`;
  fs.writeFileSync(`public/image${i}.svg`, svg);
}
console.log('Created 10 placeholder images');
