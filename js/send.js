var config = require( "./config.json" );

var aws = require( "aws-sdk" );
var Q = require ( "q" );
var chalk = require( "chalk" );

var sqs = new aws.SQS({
  region: config.aws.region,
  accessKeyId: config.aws.accessID,
  secretAccessKey: config.aws.secretKey,
  params: {
    QueueUrl: config.aws.queueURL
  }
})

var sendMessage = Q.nbind( sqs.sendMessage, sqs );

sendMessage({
  MessageBody: "This is my first ever SQS request!"
})
.then( function handleSendResolve( data) {
  console.log( chalk.green( "Message sent:", data.MessageId ) );
})
.catch( function handleReject( error) {
  console.log( chalk.red( "Unexpected Error:", error.message ) );
})
