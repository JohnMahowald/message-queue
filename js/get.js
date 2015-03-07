var config = require( "./config.json" );

var aws = require("aws-sdk");
var Q = require("q");
var chalk = require("chalk");

var sqs = new aws.SQS({
  region: config.aws.region,
    accessKeyId: config.aws.accessID,
    secretAccessKey: config.aws.secretKey,
    params: {
      QueueUrl: config.aws.queueURL
    }
});

var receiveMessage = Q.nbind( sqs.receiveMessage, sqs);
var deleteMessage = Q.nbind( sqs.deleteMessage, sqs);

(function pollQueueForMessages() {
  console.log( chalk.yellow( "Starting long-poll operation." ) );

  receiveMessage({
    WaitTimeSeconds: 3,
    VisibilityTimeout: 10
  })
 
  .then( function handleMessageResolve(data) {
    if (!data.Messages) {
      throw( 
        workflowError("EmptyQueue", new Error( "There are no messages to process." ))
      );
    }

    console.log( chalk.green( "Deleting:", data.Messages[0].MessageId ) );

    return ( deleteMessage({ ReceiptHandle: data.Messages[0].ReceiptHandle }) )
  })

  .then( function handleDeleteResolve( data ) {
    console.log( chalk.green("Message Deleted!"));
  })

  .catch( function handleError(error) {
    switch(error.type) {
      case "EmptyQueue":
        console.log( chalk.cyan( "Expected Error:", error.message ) );
      break;
      default:
        console.log( chalk.red( "Unexpected Error:", errormessage ) );
      break;
    }
  })

  .finally( pollQueueForMessages );
})();

function workflowError(type, error) {
  error.type = type;

  return(error);
}
