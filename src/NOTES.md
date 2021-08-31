useEffect(()=>{
	setRawDmg(((weaponTotalAtk*dmgVariance)+baseAtk-enemyDef)*multipliers/5)
},[weaponTotalAtk,dmgVariance,baseAtk,enemyDef,multipliers])

**Hello**


**Min** =
(
  (
    ( Weapon Attack Power + Weapon Enhancement)
    * Minimum Damage Variance
  )
  + Base Attack Power
  - Enemy Defense
)
* Multipliers
/ 5


**Max** =
  (
      Weapon Attack Power
    + Weapon Enhancement
    + Base Attack Power
    - Enemy Defense
  )
  * Multipliers
  / 5


**Average Non-Crit** =
  (
      Min
    + Max
  )
  / 2


**Crit Damage** =
    Crit Damage Multipliers *Innate 1.2, Fixa Termina*
  * Max

**Crit Rate** =
  Innate 0.05
  + Resurgir Potential (Checkbox)
  + Fixa Fatale

**Effective Damage** =
    Average Non-Crit
  + Crit Rate
  * (
      Max
      * Crit Damage
      - Average Non-Crit
    )



                            Attack Multiplier 				based on Normal Atk or PA used						NEED TO ADD TO DB
**Checkbox**                Part Multiplier					  Usually 1 or 1.5 									CUSTOM FIELD - db way later?
**Checkbox**                Elemental Weakness Multiplier	1.2 												CHECKBOX - db way later?
**Auto**                    Main Class Weapon Boost			1.1 												AUTO - already in db
**Auto**                    Class Skill Multiplier 																NEED TO ADD TO DB
                            Equip Multipliers																	
**Selector**                Augment																			AUTO - already in db
**Dropdown**      	        Elemental Weapon 			1.15 against weak, 1.1 against non-weak				DROPDOWN
**Auto**                    Crit Multis 					1.2 base + whatever									AUTO - (preset skill termina, already in db)
**Radio Button**                Appropriate Distance 																FOR UI, CHECK IF BELOW THEN SHOW DROPDOWN
                              Assault Rifle				Close Range 1.1, Mid Range 1.2, Long Range 1.0
                              TMG							Close Range 1.1, Mid Range 1.2, Long Range 1.0
                              Wired Lance					Short Range 1.0, Mid Range 1.2
**Selector**                    Food Boost																			AUTO - ALREADY IN DB
**Need - Check Drome??**                    Field Effects 					Region Mag 1.05, Drone Boost 1.1					CHECKBOX
                            Status Ailment to Player 		burn 0.9-0.95										IDC RN - IMPLEMENTED VIA CUSTOM BOX
                            Enemy Special Corrections
**Radio Button**	              UQ Boss						BREAK damage 2.0									CHECKBOX -> ENEMY
**Radio Button**	              Gigantix					0.5													CHECKBOX -> ENEMY
                            Enemy Shifta/Deband			worry later

**Input Number**            High-Level Enemy 				Enemy level  >=5 player level, dmg x 0

**Input Number**            Enemy Defense

Base Damage = (Attack Power - Enemy Defense)
* (all multipliers, including Attack Multiplier, Part Multiplier, Main Class Weapon Boost, Class Skill Multiplier, etc.)/5



https://docs.google.com/spreadsheets/d/1F952a5BxqlbnB2DWQWWdjiCB_6xI70Gc6FQDU2OUOT4/edit#gid=0																											
Data Verfication Data
https://docs.google.com/spreadsheets/d/1_OgubzM5QFe4rua4Xu0GSMAI8Idoq8r2yI8Ioyec6oY/edit#gid=661779228


MORE DATABASE STUFF 
LATER Enemy Data
	Level
	Defense
	Attack Power

-> custom field [Level, Defense, Atk Power] <-

2. The players maximum Attack Power is determined by the level of the enemy. If the attack power is over a certain value, it will be corrected down (e.g. Lv1=900, Lv10=1068, Lv20=1292).
3. Calculate the Base Damage using the following formula.
　Base Damage = (Attack Power - Enemy Defense) * (all multipliers, including Attack Multiplier, Part Multiplier, Main Class Weapon Boost, Class Skill Multiplier, etc.)/5
4. Round the Base Damage to the nearest whole number to get the final damage."		

___

**Edge Cases**
   **Hunter**		Volkraptor
   **Gunner Sux**	Chain Boost
   **Force**		Photon Flare Short Charge
   **Techter**		Deband PP Recovery Boost
					Deband Ward Bad Condition

Chain Build Power = 60 * (Power when building 100 chain with that PA + (Power of 100 Chain, C Point Blank * 1 + Point Blank * 2 + Onslaught) + (Power of S Roll * 3))										
÷ (Frame Count when building 100 chain with that PA + (Frame Count of C Point Blank * 1 + Point Blank * 2 + Onslaught) + (Frames of S Roll * 3))				= 60 * (PA power * (100 / hit count) + 2*(C Point*1 + Point*2 + Onslaught) + S Roll*3 power)/((PA frames / 1.2)*(100 / hit count)+30+(62*3+38+38*3)/1.2)	

___



TABLE class_skill{
  id int [pk,increment,unique]
  name text
  class_id int
  icon text
  description text
}

TABLE class_skill_data{
  id int [pk,increment,unique]
  name text
  class_skill_id int
  dependency text
  level int
  effect text
  duration int
  cooldown int 
  damage_taken float
  pa_potency float
  conditional_buff boolean
  pp_recovery float
  property text
  all_damage_buff float
  active_pp_recovery float
  status_ailment_accum float
  status_ailment_duration float
  pp_consumption float
  max_hp_decrease float
  natural_pp_recovery float
  added_pp int
  pb_gauge_fortification float
}










































*/