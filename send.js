var config = require( "./config.json" );

var aws = require( "aws-sdk" );
var Q = require ( "q" );
var chalk = require( "chalk" );

console.log(config);

var sqs = new aws.SQS({
  region: config.aws.region,
  accessKeyId: config.aws.accessID,
  secretAccessKey: config.aws.secretKey

  params: {
    QueueUrl: config.aws.queueUrl
  }
})

var sendMessage = Q.nbimd( sqa.sendMessage, sqs );

sendMessage({
  MessageBody: "This is my first ever SQS request!"
})
.then( function handleSendResolve( data) {
  console.log( chalk.green( "Message sent:", data.MessageId ) );
})
.catch( function handleReject( error) {
  console.log( chalk.red( "Unexpected Rerror:", error.message ) );
})
