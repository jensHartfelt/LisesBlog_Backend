
-- Selects ingredients from recipees abd turns them into a json array

SELECT recipe_id, u.first_name, u.last_name, title, description, instructions, time, agg_ingredients AS ingredients FROM (
	SELECT json_agg(r3) AS agg_ingredients FROM (
		SELECT quantity, u.short_name, i.name, i.price_per_unit FROM
			( 
				SELECT value->>'quantity' AS quantity, value->>'ingredient_id' AS special_ingredient_id FROM 
					(
						SELECT * 
						FROM recipes
						WHERE recipe_id = 36
					) r
				JOIN LATERAL jsonb_array_elements(ingredients) AS obj(value) ON obj.value->>'ingredient_id'=obj.value->>'ingredient_id'
			) r2
		JOIN ingredients AS i ON special_ingredient_id = i.ingredient_id::text
		JOIN units AS u ON u.unit_id = i.unit_id
	) as r3
) as r4, recipes
INNER JOIN users AS u USING (user_id)




SELECT recipe_id, u.first_name, u.last_name, title, description, instructions, time, value->>'quantity', value->>'json_ingredient_id' FROM recipes
JOIN LATERAL jsonb_array_elements(ingredients) AS obj(value) ON obj.value->>'ingredient_id'=obj.value->>'ingredient_id'
JOIN ingredients AS i ON json_ingredient_id = i.ingredient_id::text
JOIN units AS u ON u.unit_id = i.unit_id
INNER JOIN users AS u USING (user_id)



[{
    "price_per_unit": 22214512.45,
    "name": "Æg",
    "short_name": "stk",
    "quantity": "4"
},{
    "price_per_unit": 9.95,
    "name": "Mælk",
    "short_name": "l",
    "quantity": "1"
},{
    "price_per_unit": 8.65,
    "name": "Mel",
    "short_name": "kg",
    "quantity": "0.2"
},{
    "price_per_unit": 22214512.45,
    "name": "Æg",
    "short_name": "stk",
    "quantity": "12"
},{
    "price_per_unit": 8.65,
    "name": "Mel",
    "short_name": "kg",
    "quantity": "0.02"
}]



[{
    "price_per_unit": 22214512.45,
    "name": "Æg",
    "short_name": "stk",
    "quantity": "4"
},{
    "price_per_unit": 9.95,
    "name": "Mælk",
    "short_name": "l",
    "quantity": "1"
},{
    "price_per_unit": 8.65,
    "name": "Mel",
    "short_name": "kg",
    "quantity": "0.2"
},{
    "price_per_unit": 22214512.45,
    "name": "Æg",
    "short_name": "stk",
    "quantity": "12"
},{
    "price_per_unit": 8.65,
    "name": "Mel",
    "short_name": "kg",
    "quantity": "0.02"
}]







SELECT json_agg(r3) AS ingredients FROM (
	SELECT quantity, u.short_name, i.name, i.price_per_unit FROM
		( 
			SELECT value->>'quantity' AS quantity, value->>'ingredient_id' AS special_ingredient_id FROM 
				(
					SELECT * 
					FROM recipes
					WHERE recipe_id = 36
				) r
			JOIN LATERAL jsonb_array_elements(ingredients) AS obj(value) ON obj.value->>'ingredient_id'=obj.value->>'ingredient_id'
		) r2
	JOIN ingredients AS i ON special_ingredient_id = i.ingredient_id::text
	JOIN units AS u ON u.unit_id = i.unit_id
) as r3


SELECT recipe_id, u.first_name, u.last_name, title, description, instructions, time, agg_ingredients AS ingredients FROM (
	SELECT json_agg(r3) AS agg_ingredients FROM (
		SELECT quantity, u.short_name, i.name, i.price_per_unit FROM
			( 
				SELECT value->>'quantity' AS quantity, value->>'ingredient_id' AS special_ingredient_id FROM 
					(
						SELECT * 
						FROM recipes
					) r
				JOIN LATERAL jsonb_array_elements(ingredients) AS obj(value) ON obj.value->>'ingredient_id'=obj.value->>'ingredient_id'
			) r2
		JOIN ingredients AS i ON special_ingredient_id = i.ingredient_id::text
		JOIN units AS u ON u.unit_id = i.unit_id
	) as r3
) as r4, recipes
INNER JOIN users AS u USING (user_id)




SELECT value->>'quantity' AS quantity, value->>'ingredient_id' AS special_ingredient_id FROM 
	(
		SELECT ingredients 
		FROM recipes
	) r
JOIN LATERAL jsonb_array_elements(ingredients) AS obj(value) ON obj.value->>'ingredient_id'=obj.value->>'ingredient_id'              



























































INSERT INTO recipes (user_group_id, user_id, public, title, description, time, instructions, ingredients) VALUES
(1, 2, true, 'Tærte med æg', 'Lægger hjemmelavet tærte med æg m.m.', 20, 'Lav en tærte bund, fyld den med æg. Tada.', 
'[{"ingredient_id": 9, "quantity": 12}, {"ingredient_id": 12, "quantity": 0.02}]')





SELECT ingredients FROM recipes







SELECT recipe_id, u.first_name, u.last_name, title, description, instructions, time, value->>'quantity', value->>'json_ingredient_id' FROM recipes
JOIN LATERAL jsonb_array_elements(ingredients) AS obj(value) ON obj.value->>'ingredient_id'=obj.value->>'ingredient_id'
JOIN ingredients AS i ON json_ingredient_id = i.ingredient_id::text
JOIN units AS u ON u.unit_id = i.unit_id
INNER JOIN users AS u USING (user_id)













SELECT recipe_id, u.first_name, u.last_name, title, description, instructions, time, value->>'quantity', value->>'json_ingredient_id' FROM recipes
JOIN LATERAL jsonb_array_elements(ingredients) AS obj(value) ON obj.value->>'ingredient_id'=obj.value->>'ingredient_id'
JOIN ingredients AS i ON json_ingredient_id = i.ingredient_id::text
JOIN units AS u ON u.unit_id = i.unit_id
INNER JOIN users AS u USING (user_id)

SELECT value->>'quantity' AS j_quantity, value->>'ingredient_id' AS j_ingredient_id FROM recipes
JOIN LATERAL jsonb_array_elements(ingredients) AS obj(value) ON obj.value->>'ingredient_id'=obj.value->>'ingredient_id'



SELECT 
	-- Since selecting from multiple tables while using an aggregation function isn't allowed
	-- im sort of strapping the user on to the other query by doing the join here instead
	recipe_id, u.first_name, u.last_name, title, description, instructions, time, user_id, ingredients
FROM (
	-- Selects all recipes and aggregates ingredients into pseudo-rows in order to join with ingredients and units to make a
	-- human readable output
	SELECT r.recipe_id, r.title, r.description, r.instructions, r.time, r.user_id,
	json_agg(json_build_object('quantity', value->>'quantity', 'name', i.name, 'unit', u.short_name)) AS ingredients
	FROM recipes r
	JOIN jsonb_array_elements(ingredients) AS ings ON ings->>'ingredient_id'=ings->>'ingredient_id'
	JOIN ingredients i ON i.ingredient_id::text = value->>'ingredient_id'
	JOIN units u USING (unit_id)
	GROUP BY recipe_id
	) recipe
JOIN users u USING (user_id)
