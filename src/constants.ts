import { HTTPStatusCode } from "./types";

export const HTTP_STATUS_CODES: HTTPStatusCode[] = [
  // 1xx Informational
  { code: 100, title: "Continue", description: "The server has received the request headers and the client should proceed to send the request body." },
  { code: 101, title: "Switching Protocols", description: "The requester has asked the server to switch protocols and the server has agreed to do so." },
  { code: 102, title: "Processing", description: "The server has received and is processing the request, but no response is available yet." },
  { code: 103, title: "Early Hints", description: "Used to return some response headers before final HTTP message." },

  // 2xx Success
  { code: 200, title: "OK", description: "Standard response for successful HTTP requests." },
  { code: 201, title: "Created", description: "The request has been fulfilled, resulting in the creation of a new resource." },
  { code: 202, title: "Accepted", description: "The request has been accepted for processing, but the processing has not been completed." },
  { code: 203, title: "Non-Authoritative Information", description: "The server is a transforming proxy that received a 200 OK from its origin, but is returning a modified version of the origin's response." },
  { code: 204, title: "No Content", description: "The server successfully processed the request and is not returning any content." },
  { code: 205, title: "Reset Content", description: "The server successfully processed the request, but is not returning any content and requires that the requester reset the document view." },
  { code: 206, title: "Partial Content", description: "The server is delivering only part of the resource due to a range header sent by the client." },
  { code: 207, title: "Multi-Status", description: "The message body that follows is by default an XML message and can contain a number of separate response codes." },
  { code: 208, title: "Already Reported", description: "The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response." },
  { code: 226, title: "IM Used", description: "The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance." },

  // 3xx Redirection
  { code: 300, title: "Multiple Choices", description: "Indicates multiple options for the resource from which the client may choose." },
  { code: 301, title: "Moved Permanently", description: "This and all future requests should be directed to the given URI." },
  { code: 302, title: "Found", description: "Tells the client to look at (browse to) another URL. 302 has been superseded by 303 and 307." },
  { code: 303, title: "See Other", description: "The response to the request can be found under another URI using the GET method." },
  { code: 304, title: "Not Modified", description: "Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match." },
  { code: 305, title: "Use Proxy", description: "The requested resource is available only through a proxy, the address for which is provided in the response." },
  { code: 307, title: "Temporary Redirect", description: "In this case, the request should be repeated with another URI; however, future requests should still use the original URI." },
  { code: 308, title: "Permanent Redirect", description: "The request and all future requests should be repeated using another URI." },

  // 4xx Client Errors
  { code: 400, title: "Bad Request", description: "The server cannot or will not process the request due to an apparent client error." },
  { code: 401, title: "Unauthorized", description: "Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided." },
  { code: 402, title: "Payment Required", description: "Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micro payment system." },
  { code: 403, title: "Forbidden", description: "The request was a valid request, but the server is refusing to respond to it." },
  { code: 404, title: "Not Found", description: "The requested resource could not be found but may be available in the future." },
  { code: 405, title: "Method Not Allowed", description: "A request method is not supported for the requested resource." },
  { code: 406, title: "Not Acceptable", description: "The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request." },
  { code: 407, title: "Proxy Authentication Required", description: "The client must first authenticate itself with the proxy." },
  { code: 408, title: "Request Timeout", description: "The server timed out waiting for the request." },
  { code: 409, title: "Conflict", description: "Indicates that the request could not be processed because of conflict in the request." },
  { code: 410, title: "Gone", description: "Indicates that the resource requested is no longer available and will not be available again." },
  { code: 411, title: "Length Required", description: "The request did not specify the length of its content, which is required by the requested resource." },
  { code: 412, title: "Precondition Failed", description: "The server does not meet one of the preconditions that the requester put on the request." },
  { code: 413, title: "Payload Too Large", description: "The request is larger than the server is willing or able to process." },
  { code: 414, title: "URI Too Long", description: "The URI provided was too long for the server to process." },
  { code: 415, title: "Unsupported Media Type", description: "The request entity has a media type which the server or resource does not support." },
  { code: 416, title: "Range Not Satisfiable", description: "The client has asked for a portion of the file, but the server cannot supply that portion." },
  { code: 417, title: "Expectation Failed", description: "The server cannot meet the requirements of the Expect request-header field." },
  { code: 418, title: "I'm a teapot", description: "Any attempt to brew coffee with a teapot should result in the error code \"418 I'm a teapot\". The resulting entity body MAY be short and stout." },
  { code: 421, title: "Misdirected Request", description: "The request was directed at a server that is not able to produce a response." },
  { code: 422, title: "Unprocessable Entity", description: "The request was well-formed but was unable to be followed due to semantic errors." },
  { code: 423, title: "Locked", description: "The resource that is being accessed is locked." },
  { code: 424, title: "Failed Dependency", description: "The request failed due to failure of a previous request." },
  { code: 425, title: "Too Early", description: "Indicates that the server is unwilling to risk processing a request that might be replayed." },
  { code: 426, title: "Upgrade Required", description: "The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field." },
  { code: 428, title: "Precondition Required", description: "The origin server requires the request to be conditional." },
  { code: 429, title: "Too Many Requests", description: "The user has sent too many requests in a given amount of time." },
  { code: 431, title: "Request Header Fields Too Large", description: "The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large." },
  { code: 451, title: "Unavailable For Legal Reasons", description: "A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource." },

  // 5xx Server Errors
  { code: 500, title: "Internal Server Error", description: "A generic error message, given when an unexpected condition was encountered and no more specific message is suitable." },
  { code: 501, title: "Not Implemented", description: "The server either does not recognize the request method, or it lacks the ability to fulfil the request." },
  { code: 502, title: "Bad Gateway", description: "The server was acting as a gateway or proxy and received an invalid response from the upstream server." },
  { code: 503, title: "Service Unavailable", description: "The server is currently unable to handle the request (because it is overloaded or down for maintenance)." },
  { code: 504, title: "Gateway Timeout", description: "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server." },
  { code: 505, title: "HTTP Version Not Supported", description: "The server does not support the HTTP protocol version used in the request." },
  { code: 506, title: "Variant Also Negotiates", description: "Transparent content negotiation for the request results in a circular reference." },
  { code: 507, title: "Insufficient Storage", description: "The server is unable to store the representation needed to complete the request." },
  { code: 508, title: "Loop Detected", description: "The server detected an infinite loop while processing the request." },
  { code: 510, title: "Not Extended", description: "Further extensions to the request are required for the server to fulfil it." },
  { code: 511, title: "Network Authentication Required", description: "The client needs to authenticate to gain network access." },
];

export const STUDY_SETS = {
  TOP_10: [200, 201, 204, 400, 401, 403, 404, 409, 500, 503],
  TOP_16: [200, 201, 204, 304, 400, 401, 403, 404, 405, 409, 415, 422, 429, 500, 503, 504],
  TOP_20: [200, 201, 202, 204, 304, 308, 400, 401, 403, 404, 405, 409, 413, 415, 422, 429, 500, 502, 503, 504],
};
