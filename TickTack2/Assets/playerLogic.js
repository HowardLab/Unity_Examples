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
var roundStartTime = 0;
var pushedTime = 0;
var event = 0;
var outputFile : System.IO.StreamWriter;

function Start () {
	outputFile = File.CreateText("report.txt");
	event = 1;
	round = 1;
	roundStartTime = 0;
	log(round,0,"Round "+round+" started");
}

function Update () {
	if(event==1 && Time.time>roundStartTime+event1Time)
	{
		log(round,1,"Started playing instructions");
		if(event2Time==0)
			event = 3;
		else
			event = 2;
		if(event1Audio!=null)
			event1Audio.Play();
	}
	if(event==2 && ((event2Time==-1 && event1Audio && !event1Audio.isPlaying) || Time.unscaledTime>roundStartTime+event2Time))
	{
		log(round,2,"Player now allowed to push enemy");
		event = 3;
	}
	if(event==3 && Input.GetButtonDown("Fire1"))
	{
		var hit : RaycastHit;
		if(Physics.Raycast(transform.position, transform.TransformDirection(Vector3.forward), hit))
		{
			if(hit.transform==enemy)
			{
				event = 4;
				log(round,3,"Player push enemy");
				if(event3Audio!=null)
					event3Audio.Play();
				pushedTime = Time.unscaledTime;
				hit.transform.SendMessage("Punch",SendMessageOptions.DontRequireReceiver);
			}
			else
				log(round,3,"Player missed enemy, hit floor");
		}
		else
			log(round,3,"Player missed enemy, hit sky");
	}
	if(event==4 && Time.unscaledTime>pushedTime+event4Time)
	{
		//Reset
		event = 1;
		roundStartTime = Time.unscaledTime;
		enemy.SendMessage("Reset",SendMessageOptions.DontRequireReceiver);
		pushedTime = 0;
		round++;
		log(round,0,"Round "+round+" started");
	}
}
function log(round,event,msg)
{
	print("["+round+":"+event+"]"+msg);
	
	outputFile.WriteLine("["+Time.unscaledTime+":"+round+":"+event+"]"+msg);
	outputFile.Flush();
}