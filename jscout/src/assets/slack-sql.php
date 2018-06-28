<?php
// SQL query script
// Original base script at:
// https://github.com/PenguinSnail/mysql-slack

// Domain the database and scouting app are running on
// Must include path the `csv` export folder is located in
$domain = "http://domain.site/assets/";

// Grab some of the values from the slash command, create vars for post back to Slack
$command = $_POST['command'];
$slackname = $_POST['user_name'];
$text = $_POST['text'];
$token = $_POST['token'];

// Parse config file
// $config = parse_ini_file('/assets/private/slack.ini');

// MySQL vars (temporarily hardcoded until config works)
$servername = "";
$username = "";
$password = "";
$dbname = "";

// URL to your Slack Incoming Webhook
$webhook = "";

// Check the token and make sure the request is from our team
if($token != $config['token']){
    $msg = "The token for the slash command doesn't match.";
    die($msg);
}

// Extract operation from passed text
$oper = strtok($text, " ");
$oper = strtolower($oper);

// Extract remaining arguments from passed text
$words = explode(' ', $text);
$words = array_slice($words, 1);
$args = implode(' ', $words);

// Determine operation and set query
if ($oper == "query") {
	if (strtok($args, " ") == "drop") {
		die("I'm afraid I can't let you do that...");
	} else {
		$query = $args;
	}
} elseif ($oper == "match") {
	$args = preg_replace("/[^0-9,.]/", "", strtok($args, " "));
	$query = "select * from FormData where MatchNumber = " . $args;
} elseif ($oper == "team") {
	$args = preg_replace("/[^0-9,.]/", "", strtok($args, " "));
	$query = "select * from FormData where TeamNumber = " . $args;
} elseif ($oper == "list") {
	$args = strtok($args, " ");
	if (strpos($args, "team") !== false) {
		$query = "select distinct TeamNumber from FormData order by TeamNumber";
	} elseif (strpos($args, "match") !== false) {
		$query = "select distinct MatchNumber from FormData order by MatchNumber";
	} else {
		die("List what? (teams/matches)");
	}
} elseif ($oper == "average") {
	$args = preg_replace("/[^0-9,.]/", "", strtok($args, " "));
	$query = "select (select avg(AutoSwitchCubes) from FormData where TeamNumber = " . $args . "), (select avg(AutoScaleCubes) from FormData where TeamNumber = " . $args . "), (select avg(TeleSwitchCubes) from FormData where TeamNumber = " . $args . "), (select avg(TeleScaleCubes) from FormData where TeamNumber = " . $args . "), (select avg(PortalReturnedCubes) from FormData where TeamNumber = " . $args . ")";
} else {
	die("List/Match/Team/Average/Query - List tables/Match data/Team data/Average team numbers/Query database");
}

// Check connection
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}

// Run query
if (!$result = $conn->query($query)) {
	die("ERROR: " . $conn->error);
}

if ($result == "") {
	die("No data found :(");
}

// create csv and output text contents
$i = 0;
$csvcont = "";
while($row = $result->fetch_assoc()) {
	if ($i == 0) {
		$i++;
   		foreach ($row as $key => $value) {
			if ($oper == "average") {
				$key = substr($key, 1, -1);
				preg_match( '!\(([^\)]+)\)!', $key, $match);
				$key = $match[1];
			}
       		$csvcont .= $key;
			$csvcont .= ",";
			$output .= str_pad($key,11," ");
			$output .= " | ";
		}
	}
	$csvcont .= "\n";
	$output .= "\n";
	foreach ($row as $value) {
		$csvcont .= $value;
		$csvcont .= ",";
		$output .= str_pad($value,15," ");
		$output .= " | ";
	}
}

//Write to csv file
if ($args == "" ) {
	$file = $oper . ".csv";
} else {
	$file = $oper . "_" . $args . ".csv";
}
$filewrite = "./csv/" . $file;
file_put_contents($filewrite, $csvcont);

// Build JSON from arrays
$data = array(
	"username" => "Scouting Database",
	"channel" => "@" . $slackname,
	"text" => $output,
	"attachments" => array(
		array(
			"fallback" => "CSV Table",
			"color" => "#36a64f",
			"title" => "CSV File",
			"title_link" => $domain . "csv/" . $file
		)
	)
);
$payload = json_encode($data);

// Issue cURL command
$slack_call = curl_init($webhook);
curl_setopt($slack_call, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($slack_call, CURLOPT_POSTFIELDS, $payload);
curl_setopt($slack_call, CURLOPT_CRLF, true);
curl_setopt($slack_call, CURLOPT_RETURNTRANSFER, true);
curl_setopt($slack_call, CURLOPT_HTTPHEADER, array(
    "Content-Type: application/json",
    "Content-Length: " . strlen($payload))
);

curl_exec($slack_call);
curl_close($slack_call);

die();

?>
