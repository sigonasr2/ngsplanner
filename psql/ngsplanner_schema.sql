CREATE TABLE "food_mult" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "amount" int,
  "potency" float,
  "pp" int,
  "dmg_res" float,
  "hp" float,
  "pp_consumption" float,
  "pp_recovery" float,
  "weak_point_dmg" float,
  "hp_recovery" float
);

CREATE TABLE "food" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "material" text,
  "potency" boolean,
  "pp" boolean,
  "dmg_res" boolean,
  "hp" boolean,
  "pp_consumption" boolean,
  "pp_recovery" boolean,
  "weak_point_dmg" boolean,
  "hp_recovery" boolean
);

CREATE TABLE "class" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text
);

CREATE TABLE "class_weapon_type_data" (
  "class_id" int,
  "weapon_type_id" int
);

CREATE TABLE "class_level_data" (
  "class_id" int,
  "level" int,
  "hp" int,
  "atk" int,
  "def" int
);

CREATE TABLE "weapon" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text,
  "rarity" int,
  "level_req" int,
  "atk" int,
  "potential_id" int,
  "variance" float,
  "base_affix_slots" int,
  "drop_info" text,
  "pb_gauge_build" float
);

CREATE TABLE "weapon_type" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text
);

CREATE TABLE "potential" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text
);

CREATE TABLE "potential_data" (
  "potential_id" int,
  "level" int,
  "mel_dmg" float,
  "rng_dmg" float,
  "tec_dmg" float,
  "crit_rate" float,
  "crit_dmg" float,
  "pp_cost_reduction" float,
  "active_pp_recovery" float,
  "natural_pp_recovery" float,
  "dmg_res" float,
  "all_down_res" float,
  "burn_res" float,
  "freeze_res" float,
  "blind_res" float,
  "shock_res" float,
  "panic_res" float,
  "poison_res" float,
  "battle_power_value" int,
  "pb_gauge_build" float
);

CREATE TABLE "armor" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text,
  "rarity" int,
  "level_req" int,
  "def" int,
  "hp" int,
  "pp" int,
  "mel_dmg" float,
  "rng_dmg" float,
  "tec_dmg" float,
  "crit_rate" float,
  "crit_dmg" float,
  "pp_cost_reduction" float,
  "active_pp_recovery" float,
  "natural_pp_recovery" float,
  "dmg_res" float,
  "all_down_res" float,
  "burn_res" float,
  "freeze_res" float,
  "blind_res" float,
  "shock_res" float,
  "panic_res" float,
  "poison_res" float,
  "battle_power_value" int,
  "pb_gauge_build" float
);

CREATE TABLE "augment" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "augment_type_id" int,
  "level" int,
  "variance" float,
  "hp" int,
  "pp" int,
  "mel_dmg" float,
  "rng_dmg" float,
  "tec_dmg" float,
  "crit_rate" float,
  "crit_dmg" float,
  "pp_cost_reduction" float,
  "active_pp_recovery" float,
  "natural_pp_recovery" float,
  "dmg_res" float,
  "affix_success_rate" float,
  "all_down_res" float,
  "burn_res" float,
  "freeze_res" float,
  "blind_res" float,
  "shock_res" float,
  "panic_res" float,
  "poison_res" float,
  "battle_power_value" int,
  "pb_gauge_build" float
);

CREATE TABLE "skill" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text,
  "skill_type_id" int
);

CREATE TABLE "skill_data" (
  "skill_id" int,
  "level" int,
  "variance" float,
  "mel_dmg" float,
  "rng_dmg" float,
  "tec_dmg" float,
  "crit_rate" float,
  "crit_dmg" float,
  "pp_cost_reduction" float,
  "active_pp_recovery" float,
  "natural_pp_recovery" float,
  "dmg_res" float
);

CREATE TABLE "skill_type" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" text UNIQUE,
  "email" text UNIQUE,
  "password_hash" text,
  "created_on" timestamptz,
  "role_id" int
);

CREATE TABLE "roles" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text
);

CREATE TABLE "builds" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "user_id" int,
  "creator" text,
  "build_name" text,
  "class1" int,
  "class2" int,
  "created_on" timestamptz,
  "last_modified" timestamptz,
  "likes" int,
  "data" text
);

CREATE TABLE "weapon_existence_data" (
  "weapon_type_id" int,
  "weapon_id" int
);

CREATE TABLE "augment_type" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text
);

ALTER TABLE "class_weapon_type_data" ADD FOREIGN KEY ("class_id") REFERENCES "class" ("id");

ALTER TABLE "class_level_data" ADD FOREIGN KEY ("class_id") REFERENCES "class" ("id");

ALTER TABLE "class_weapon_type_data" ADD FOREIGN KEY ("weapon_type_id") REFERENCES "weapon_type" ("id");

ALTER TABLE "weapon" ADD FOREIGN KEY ("potential_id") REFERENCES "potential" ("id");

ALTER TABLE "potential_data" ADD FOREIGN KEY ("potential_id") REFERENCES "potential" ("id");

ALTER TABLE "skill_data" ADD FOREIGN KEY ("skill_id") REFERENCES "skill" ("id");

ALTER TABLE "skill" ADD FOREIGN KEY ("skill_type_id") REFERENCES "skill_type" ("id");

ALTER TABLE "builds" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "builds" ADD FOREIGN KEY ("class1") REFERENCES "class" ("id");

ALTER TABLE "builds" ADD FOREIGN KEY ("class2") REFERENCES "class" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

ALTER TABLE "weapon_existence_data" ADD FOREIGN KEY ("weapon_id") REFERENCES "weapon" ("id");

ALTER TABLE "weapon_existence_data" ADD FOREIGN KEY ("weapon_type_id") REFERENCES "weapon_type" ("id");

ALTER TABLE "augment" ADD FOREIGN KEY ("augment_type_id") REFERENCES "augment_type" ("id");
