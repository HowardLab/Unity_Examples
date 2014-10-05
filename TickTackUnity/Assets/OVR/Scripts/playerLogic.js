#pragma strict
import System;
import System.IO;

var enemy : Transform;
var numberOfRounds : int;
// Event 1: Instructions start
var event1Time : float;//Time from round start
var event1Audio : AudioSource;
// Event 2: Allow player to push enemy
var event2Time : float;//Seconds after instructions started (-1 for when instructions stop)
// Event 3 : Push enemy
var event3Audio : AudioSource;
// Event 4: New round
var event4Time : int;//Timed from push (Animation lasts 0.6 seconds)

var round = 1;
// Time : float = 0;
var pushedTime : float = 0;

var event = 0;
var outputFile : System.IO.StreamWriter;

function Start () {
	outputFile = File.CreateText("report.txt");
	event = 1;
	round = 1;
	log(round,0,"Round "+round+" started");
}

function Update () {

	
	// decode with state machine
	switch (event)
	{
	// starting
	case 1:
			log(round,1,"Started playing instructions");

		// play the message
		if(event1Audio!=null){
			event1Audio.Play();
			
			// move to next event
			event = 2;
		}
		else{
			// exit if failed
			GameOver();
		}
		break;
	
	case 2:
		// after sound finished
		if( event1Audio && !event1Audio.isPlaying)
		{
			log(round,2,"Player now allowed to push enemy");
			event = 3;
		}
		break;
	
	case 3:
		// detect push
		if( Input.GetButtonUp("Fire1") || (Input.GetAxis("Vertical")>0.2) )
		{

					
			var hit : RaycastHit;
			if(Physics.Raycast(transform.position, transform.TransformDirection(Vector3.forward), hit))
			{
				// detect hit
				if(hit.transform==enemy)
				{
					event = 4;
					log(round,3,"Player hit enemy");
				
					// player hit sound
					if(event3Audio!=null){
						event3Audio.Play();
					}
				
					pushedTime = Time.unscaledTime;
					hit.transform.SendMessage("Punch",SendMessageOptions.DontRequireReceiver);
				}
			}
			else
			{
			
				event = 4;
				log(round,3,"Player missed enemy");
				pushedTime = Time.unscaledTime;
			}
		}
		break;
	
		// wait 3 sec before starting again
		case 4:

		if(Time.unscaledTime> (pushedTime+3.0) )
		{
			//Reset
			event = 1;
			enemy.SendMessage("Reset",SendMessageOptions.DontRequireReceiver);
			round++;
			log(round,0,"Round "+round+" started");
		}
		break;
	}
	// check for rounds done condition
	if(round > numberOfRounds)
	{
		GameOver();
		
	}
}

// terminate the program
function GameOver () 
{
	log(round,0,"Round "+round+" FINISHED");
    Application.Quit();
}

// log status and time
function log(round,event,msg)
{
	print("["+round+":"+event+"]"+msg+"RT=["+Time.unscaledTime);
	outputFile.WriteLine("["+Time.unscaledTime+":"+round+":"+event+"]"+msg);
	outputFile.Flush();
}