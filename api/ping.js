module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: ' API Working with Replicate!',
    timestamp: new Date().toISOString(),
    hasReplicateToken: !!process.env.REPLICATE_API_TOKEN
  }));
};
