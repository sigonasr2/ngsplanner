delete from food_mult;delete from food;delete from armor;delete from augment;
delete from augment_type;delete from skill_data;delete from skill;delete from skill_type;delete from builds;delete from users;delete from roles;
delete from weapon_existence_data;delete from class_weapon_type_data;delete from class_level_data;delete from potential_data;delete from weapon;delete from weapon_type;delete from class;delete from potential;
insert into food_mult(amount,potency,pp,dmg_res,hp,pp_consumption,pp_recovery,weak_point_dmg,hp_recovery)
	values(0,1,0,1,1,1,1,1,1);
insert into food_mult(amount,potency,pp,dmg_res,hp,pp_consumption,pp_recovery,weak_point_dmg,hp_recovery)
	values(1,1.05,10,1.05,1.05,1,1,1,1);

insert into food(material,potency,pp,dmg_res,hp,pp_consumption,pp_recovery,weak_point_dmg,hp_recovery)
	values('Rich Aelio Meat',true,false,false,false,true,false,false,false);
insert into food(material,potency,pp,dmg_res,hp,pp_consumption,pp_recovery,weak_point_dmg,hp_recovery)
	values('Light Aelio Meat',true,false,false,false,false,true,false,false);
	
insert into class(name) values('Hunter');
insert into class(name) values('Fighter');
insert into class(name) values('Ranger');
insert into class(name) values('Gunner');
insert into class(name) values('Force');
insert into class(name) values('Techter');

insert into weapon_type(name) values('Sword');
insert into weapon_type(name) values('Spear');
insert into weapon_type(name) values('Wired Lance');
insert into weapon_type(name) values('Twin Dagger');
insert into weapon_type(name) values('Double Saber');
insert into weapon_type(name) values('Knuckles');
insert into weapon_type(name) values('Assault Rifle');
insert into weapon_type(name) values('Launcher');
insert into weapon_type(name) values('Twin Machine Guns');
insert into weapon_type(name) values('Rod');
insert into weapon_type(name) values('Talis');
insert into weapon_type(name) values('Wand');
insert into weapon_type(name) values('Legacy');

insert into potential(name) values('Recycler Unit');
insert into potential(name) values('Indomitable Unit');
insert into potential(name) values('Defensive Formation');
insert into potential(name) values('Offensive Formation');
insert into potential(name) values('Bastion Unit');
insert into potential(name) values('Meditation Unit');
insert into potential(name) values('Mustered Might Unit');
insert into potential(name) values('Dynamo Unit');
insert into potential(name) values('Berserk Unit');
insert into potential(name) values('Wellspring Unit');
insert into potential(name) values('Endurance Unit');

insert into class_level_data(class_id,level,hp,atk,def)
	values((SELECT id from class WHERE name='Hunter'),1,300,450,304);
insert into class_level_data(class_id,level,hp,atk,def)
	values((SELECT id from class WHERE name='Hunter'),2,303,459,309);
insert into class_level_data(class_id,level,hp,atk,def)
	values((SELECT id from class WHERE name='Fighter'),1,280,454,301);
insert into class_level_data(class_id,level,hp,atk,def)
	values((SELECT id from class WHERE name='Ranger'),1,240,448,300);
	
insert into class_weapon_type_data(class_id,weapon_type_id)
	values((SELECT id from class WHERE name='Hunter'),(SELECT id from weapon_type WHERE name='Sword'));
insert into class_weapon_type_data(class_id,weapon_type_id)
	values((SELECT id from class WHERE name='Hunter'),(SELECT id from weapon_type WHERE name='Spear'));
insert into class_weapon_type_data(class_id,weapon_type_id)
	values((SELECT id from class WHERE name='Hunter'),(SELECT id from weapon_type WHERE name='Wired Lance'));
insert into class_weapon_type_data(class_id,weapon_type_id)
	values((SELECT id from class WHERE name='Fighter'),(SELECT id from weapon_type WHERE name='Twin Dagger'));
insert into class_weapon_type_data(class_id,weapon_type_id)
	values((SELECT id from class WHERE name='Fighter'),(SELECT id from weapon_type WHERE name='Double Saber'));
insert into class_weapon_type_data(class_id,weapon_type_id)
	values((SELECT id from class WHERE name='Fighter'),(SELECT id from weapon_type WHERE name='Knuckles'));
	
insert into weapon(name,rarity,level_req,atk,potential_id,variance,base_affix_slots,drop_info,pb_gauge_build)
	values('Primm',1,1,177,(select id from potential where name='Recycler Unit'),0.7,2,'Central City Item Shop, Common Drop',0);
insert into weapon(name,rarity,level_req,atk,potential_id,variance,base_affix_slots,drop_info,pb_gauge_build)
	values('Tzvia',2,4,195,(select id from potential where name='Indomitable Unit'),0.7,2,'Central City Item Shop, Common Drop',0);
	
insert into potential_data(potential_id,level,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from potential where name='Recycler Unit'),1,1.18,1.18,1.18,0,0,0,0,0,0,0,0,0,0,0,0,0,10,0);
insert into potential_data(potential_id,level,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from potential where name='Recycler Unit'),2,1.20,1.20,1.20,0,0,0,0,0,0,0,0,0,0,0,0,0,20,0);
insert into potential_data(potential_id,level,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from potential where name='Indomitable Unit'),1,1.18,1.18,1.18,0,0,0,0,0,0,1.10,0,0,0,0,0,0,10,0);
	
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Sword'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Spear'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Wired Lance'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Twin Dagger'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Double Saber'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Knuckles'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Assault Rifle'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Launcher'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Twin Machine Guns'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Rod'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Talis'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Wand'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Sword'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Spear'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Wired Lance'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Twin Dagger'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Double Saber'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Knuckles'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Assault Rifle'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Launcher'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Twin Machine Guns'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Rod'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Talis'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Wand'),(select id from weapon where name='Tzvia'));
	
	
insert into roles(name)
	values('Administrator');
insert into roles(name)
	values('Editor');
insert into roles(name)
	values('Guest');
	
insert into users(username,email,password_hash,created_on,role_id)
	values('sigonasr2','sigonasr2@gmail.com','ABCDEFG','2021-07-13 04:30+00',(select id from roles where name='Administrator'));
insert into users(username,email,password_hash,created_on,role_id)
	values('sigonasr3','sigonasr3@gmail.com','ABCDEF','2021-07-14 05:30+00',(select id from roles where name='Editor'));
	
insert into builds(user_id,creator,build_name,class1,class2,created_on,last_modified,likes,data)
	values((select id from users where username='sigonasr2'),'sigonasr2','Test Build',(select id from class where name='Ranger'),(select id from class where name='Force'),'2021-07-13 04:30+00','2021-07-13 04:30+00',5,'<DATA STRING>');
insert into builds(user_id,creator,build_name,class1,class2,created_on,last_modified,likes,data)
	values((select id from users where username='sigonasr3'),'sigonasr3','Test Build2',(select id from class where name='Techter'),(select id from class where name='Fighter'),'2021-07-13 06:30+00','2021-07-13 07:30+00',27,'<DATA STRING>');
	
insert into skill_type(name)
	values('Weapon');
insert into skill_type(name)
	values('Armor');
	
insert into skill(name,skill_type_id)
	values('Fixa Attack',(select id from skill_type where name='Weapon'));
insert into skill(name,skill_type_id)
	values('Fixa Guard',(select id from skill_type where name='Armor'));
insert into skill(name,skill_type_id)
	values('Fixa Termina',(select id from skill_type where name='Weapon'));
	
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Attack'),1,0,1.02,1.02,1.02,0,0,0,0,0,0);
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Attack'),2,0,1.03,1.03,1.03,0,0,0,0,0,0);
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Attack'),3,0,1.04,1.04,1.04,0,0,0,0,0,0);
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Guard'),1,0,0,0,0,0,0,0,0,0,1.01);
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Guard'),2,0,0,0,0,0,0,0,0,0,1.02);
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Guard'),3,0,0,0,0,0,0,0,0,0,1.03);
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Termina'),1,0,0,0,0,0,1.05,0,0,0,0);
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Termina'),2,0,0,0,0,0,1.08,0,0,0,0);
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Termina'),3,0,0,0,0,0,1.10,0,0,0,0);
	
insert into augment_type(name)
	values('Stamina');
insert into augment_type(name)
	values('Spirit');
insert into augment_type(name)
	values('Might');
insert into augment_type(name)
	values('Precision');

insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Stamina'),1,0,5,0,0,0,0,0,0,0,0,0,0,0.1,0,0,0,0,0,0,0,3,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Stamina'),2,0,10,0,0,0,0,0,0,0,0,0,0,0.1,0,0,0,0,0,0,0,4,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Stamina'),3,0,15,0,0,0,0,0,0,0,0,0,0,0.09,0,0,0,0,0,0,0,5,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Spirit'),1,0,0,3,0,0,0,0,0,0,0,0,0,0.1,0,0,0,0,0,0,0,2,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Spirit'),2,0,0,4,0,0,0,0,0,0,0,0,0,0.1,0,0,0,0,0,0,0,3,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Spirit'),3,0,0,5,0,0,0,0,0,0,0,0,0,0.09,0,0,0,0,0,0,0,4,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Might'),1,0,0,0,1.01,0,0,0,0,0,0,0,0,0.1,0,0,0,0,0,0,0,4,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Might'),2,0,0,0,1.015,0,0,0,0,0,0,0,0,0.1,0,0,0,0,0,0,0,5,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Might'),3,0,0,0,1.02,0,0,0,0,0,0,0,0,0.09,0,0,0,0,0,0,0,6,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Precision'),1,0,0,0,0,1.01,0,0,0,0,0,0,0,0.1,0,0,0,0,0,0,0,4,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Precision'),2,0,0,0,0,1.015,0,0,0,0,0,0,0,0.1,0,0,0,0,0,0,0,5,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Precision'),3,0,0,0,0,1.02,0,0,0,0,0,0,0,0.09,0,0,0,0,0,0,0,6,0);
	
insert into armor(name,rarity,level_req,def,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values('Primm Armor',1,1,8,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0);
insert into armor(name,rarity,level_req,def,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values('Tzvia Armor',2,1,9,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2,0);
insert into armor(name,rarity,level_req,def,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values('Theseus Armor',3,5,10,10,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.1,0);