exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, message: 'Netlify functions are active. Note: this does NOT run the WhatsApp bot.' })
  };
};
