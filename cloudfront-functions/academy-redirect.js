// CloudFront Function to redirect /academy to external URL
// Deploy this function in AWS CloudFront Console
// Associate it with a Viewer Request event for the /academy path

function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Check if the request is for /academy
  if (uri === '/academy' || uri === '/academy/') {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: {
          value: 'https://kandoknox.myclickfunnels.com/courses/online-academy'
        }
      }
    };
  }

  // Return the request unchanged for all other paths
  return request;
}

