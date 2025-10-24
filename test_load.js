try {
  require('./lib/tools/index.js');
  console.log('Module loaded successfully');
} catch (e) {
  console.error('Error:', e.message);
}
