/*
SELECT a.post_id, a.title, a.lead, a.content, a.created_at, b.name as tags, c.username FROM 
	(SELECT unnest(tag_ids) tag_id, * FROM posts) as a 
	JOIN tags as b on b.tag_id=a.tag_id
	--JOIN users as c ON c.user_id = a.owner_id
	--WHERE a.public = true
	--GROUP BY b.name



SELECT json_agg(tags_table.name) AS tags
	FROM 
	(
	 SELECT post_id, unnest(tag_ids) as tag_id 
	 FROM posts AS p
	) AS post_tags
	JOIN tags AS tags_table ON tags_table.tag_id = post_tags.tag_id
	JOIN posts AS post_table ON post_table.post_id = post_tags.post_id
GROUP BY post_tags.post_id

SELECT m.cname, m.wmname, t.mx
FROM (
    SELECT cname, MAX(avg) AS mx
    FROM makerar
    GROUP BY cname
    ) t JOIN makerar m ON m.cname = t.cname AND t.mx = m.avg
;
*/
SELECT t5.post_id, title, lead, content, tags, created_at, u.username FROM (
	SELECT t4.post_id, json_agg(t4.tag_name) AS tags FROM (
		SELECT post_id, t2.tag_id, t3.name as tag_name FROM (
			SELECT t1.post_id, unnest(t1.tag_ids) as tag_id
			FROM posts AS t1
		) AS t2
		JOIN tags as t3 ON t2.tag_id=t3.tag_id
	) AS t4
	GROUP BY t4.post_id
	ORDER BY t4.post_id
) AS t5
JOIN posts as p ON t5.post_id = p.post_id
JOIN users as u ON p.owner_id = u.user_id
WHERE public = true


UPDATE posts SET tag_ids = '{1,3,4,5}'
SELECT * FROM posts
	/*

	-- Selects all tags in a normalised way
	SELECT array_agg(t1.name) post_id, name AS tags FROM (
		SELECT *, unnest(tag_ids) as tag_id
		FROM posts
	) AS p1
	JOIN tags as t1 ON t1.tag_id=p1.tag_id
	GROUP BY p1.post_id



SELECT 
	recipe_id, user_id, u.first_name AS user_first_name, u.last_name AS user_last_name, public, title, description, instructions, time, ingredients
	FROM (
		SELECT r.recipe_id, r.title, r.description, r.instructions, r.time, r.user_id, r.public, 
		json_agg(json_build_object('quantity', value->>'quantity', 'unit', u.short_name, 'name', i.name)) AS ingredients
			FROM recipes r
				JOIN jsonb_array_elements(ingredients) AS ings ON ings->>'ingredient_id'=ings->>'ingredient_id'
				JOIN ingredients i ON i.ingredient_id::text = value->>'ingredient_id'
				JOIN units u USING (unit_id)
			GROUP BY recipe_id
			) recipe
	JOIN users u USING (user_id)
	
	*/