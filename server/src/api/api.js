class API {
  failed(reply, statusCode, message) {
    reply({
      statusCode,
      message,
    });
  }

  successed(reply, statusCode, message, data) {
    const content = {
      statusCode,
      message,
    };

    if (data) {
      content.data = data;
    }

    reply(content);
  }
}

module.exports = API;
