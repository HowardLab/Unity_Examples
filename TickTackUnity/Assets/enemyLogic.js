#pragma strict

var hit = false;

function Start () {

}

function Update () {
	
}

function Punch() {
	if(!hit)
	{
		hit = true;
		animation.Play("punch");
		animation["punch"].speed = 1;
		animation["punch"].time = 0;
	}
}

function Reset() {
	if(hit)
	{
		hit = false;
		animation.Play("punch");
		animation["punch"].speed = -1;
		animation["punch"].time = 0;
	}
}