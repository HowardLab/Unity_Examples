#pragma strict

var dmg : int = 50;
var distance : float;
var maxDistance : float = 1.5;
var mace : Transform;

function Update()
{
	if(Input.GetButtonUp("Fire1"))
	{
	mace.animation.Play("Attack");
		var hit : RaycastHit;
		if(Physics.Raycast(transform.position, transform.TransformDirection(Vector3.forward), hit))
		{
			distance = hit.distance;
			if (distance < maxDistance)
			{
				hit.transform.SendMessage("doDamage",dmg,SendMessageOptions.DontRequireReceiver);
			}
		}
	}
}