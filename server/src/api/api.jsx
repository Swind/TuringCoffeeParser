class API {
  failed(reply, statusCode, message){
    reply({
      statusCode: statusCode,
      message: message,
    });
  }

  successed(reply, statusCode, message, data){
    let content = {
      statusCode: statusCode,
      message: message,
    };

    if(data){
      content['data'] = data;
    }

    reply(content);
  }
}

module.exports = API
