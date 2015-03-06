var config = require( "./config.json" );

var aws = require( "aws-sdk" );
var Q = require ( "q" );
var chalk = require( "chalk" );

var sqs = new aws.SQS({
})
