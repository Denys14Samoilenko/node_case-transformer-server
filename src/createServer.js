const http = require('http');
const { convertToCase } = require('./convertToCase/convertToCase');
const {
  SUPPORTED_CASES,
  ERROR_CODE,
  SUCCESS_CODE,
  SUCCESS_STATUS,
  ERROR_STATUS,
  PORT,
  errorMessages,
} = require('./variables');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = SUCCESS_CODE;
    res.statusMessage = SUCCESS_STATUS;

    const normalizedURL = new URL(req.url, `http://localhost:${PORT}`);
    const formattingType = normalizedURL.searchParams.get('toCase');
    const textForFormatting = normalizedURL.pathname.slice(1);

    const errors = [];

    if (!textForFormatting) {
      errors.push({
        message: errorMessages.NoOriginalText,
      });
    }

    if (!formattingType) {
      errors.push({
        message: errorMessages.NoFormattingType,
      });
    }

    if (formattingType && !SUPPORTED_CASES.includes(formattingType)) {
      errors.push({
        message: errorMessages.WrongFormattingType,
      });
    }

    if (errors.length) {
      res.statusCode = ERROR_CODE;
      res.statusMessage = ERROR_STATUS;

      res.end(JSON.stringify({ errors }));

      return;
    }

    const convertedText = convertToCase(textForFormatting, formattingType);

    res.end(JSON.stringify({
      ...convertedText,
      targetCase: formattingType,
      originalText: textForFormatting,
    }));
  });
}

module.exports = {
  createServer,
};
