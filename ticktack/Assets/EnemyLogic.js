#pragma strict

var health : int = 100;
var dieing : boolean = false;
var isDead : boolean = false;

function doDamage(dmg : int)
{
	health -= dmg;
	if(health<=0 && !isDead)
	{
		isDead = true;
		animation.Play("EnemyDeath");
	}
}