# Introduction
This is a solo project aiming at producing a tool to generate a meal plan with a corresponding shopping list.


## Goals / Milestones
[✓] Getting the database up and working<br>
[✓] Building (and documenting) a REST api through node to communicate with the database<br>
[✓] Figuring out the user registration in regards to security and password management<br>
[ ] Creating a PWA in Vue or React (undecided) to interact with the backend<br>
[ ] Refining meal planning options<br>
[ ] Using external API's to get ingredients info<br>
[ ] Using external API's to get recipes<br>


## Problems / to-be-problems
<ul>
  <li>Ingredients may have to belong to a user. Some will be public and some not, and in the interface it should be easy to identify which ingredients the user created and what others have created. The same goes for recipes but that's a bit easier</li>
  <li>Ingredients may need an estimated expiration days. This will allow the mealplanning algorithm to generate a more sophisticated mealplan taking into account when to add each recipe. I.e. you dont want to have fresh fish of day 7 of your meal-plan</li>
</ul>

## Ideas and possibilities
<ul>
  <li>Add recipes you already have. I.e. i have 0.5kg potatoes, 200g of pasta and some tomatoes. Make a 7-days mealplan that include these ingredients</li>
  <li>Add more info about each ingredients. I.e. 'bio', 'local', 'discount', 'max price', 'min price', 'avg price','stores'</li>
</ul>


# REST API

Every endpoint should be prefixed with '/api/'. ie.: www.example.com/api/users/135

## Users

| Action                            | Type   | Endpoint               | Body                   | Status      |
| --------------------------------- | -----  | ---------------------- | ---------------------- | ----------- |
| Get all users                     | GET    | users/                 |                        | Done        |
| Get specific user by id            | GET    | users/:id              |                        | Done        |
| Get user-groups with user in them | GET    | users/:id/user-groups/ |                        | In progress | 
| Add user                          | POST   | users/                 | Reuired: first_name,  last_name, email, password | Done | 
| Edit user                         | PUT    | users/:id              | Optional: first_name, last_name, email, password        | Done | 
| Delete user                       | DELETE | users/:id              |                        | Done        | 


## Authentication

| Status      | Action                               | Type   | Endpoint               | Body                   |
| ----------- | ------------------------------------ | -----  | ---------------------- | ---------------------- |
| In progress | Login                                | POST   | auth/login             | <ul><li>email</li><li>password</li></ul> |
| In progress | Get specific recipe by id             | GET    | auth/logout            |                        |


## User groups

| Status      | Action                            | Type   | Endpoint               | Body        |
| ------------| --------------------------------- | -----  | ---------------------- | ----------- |
| In progress | Get all user-groups               | GET    | user-groups/           |             |          
| In progress | Get specific user-group by id      | GET    | user-groups/:id        |             |           
| In progress | Add user-group                    | POST   | user-groups/           | Required: name (string), members (arrays of user_id's)  |
| In progress | Edit user-group                   | PUT    | user-groups/:id        | Optional: name (string), members (arrays of user_id's) | 
| In progress | Delete user-group                 | DELETE | user-groups/:id        |             |         


## Ingredients

| Action                            | Type   | Endpoint               | Body                   | Status      |
| --------------------------------- | -----  | ---------------------- | ---------------------- | ----------- |
| Get all ingredients               | GET    | ingredients/           |                        | Done        |
| Get specific ingredient by id      | GET    | ingredients/:id        |                        | Done        |
| Add ingredient                    | POST   | ingredients/           | Required: name (string), unit_id (number), price_per_unit | Done | 
| Edit ingredient                   | PUT    | ingredients/:id   | Optional: name (string), unit_id (number), price_per_unit | Done | 
| Delete ingredient                 | DELETE | ingredients/:id |                        | Done        | 


## Units

| Action                            | Type   | Endpoint               | Body                   | Status      |
| --------------------------------- | -----  | ---------------------- | ---------------------- | ----------- |
| Get all units                     | GET    | units/                 |                        | Done        |
| Get specific unit by id            | GET    | units/:id              |                        | Done        |
| Add unit                          | POST   | units/                 | Required: name (string), unit_id (number), price_per_unit | Done | 
| Edit unit                         | PUT    | units/edit/:id         | Optional: name (string), unit_id (number), price_per_unit | Done | 
| Delete unit                       | DELETE | units/delete/:id       |                        | Done        | 


## Recipes

| Status      | Action                               | Type   | Endpoint               | Body                   |
| ----------- | ------------------------------------ | -----  | ---------------------- | ---------------------- |
| Done        | Get all recipes                      | GET    | recipes/               |                        |
| Done        | Get specific recipe by id             | GET    | recipes/:id            |                        |
| Done        | Add recipe                           | POST   | recipes/               | Required: <ul><li>user_id \<number></li><li>user_group_id \<number></li><li>title \<string></li> <li>description \<string></li><li>time \<number> (minutes)</li><li>instructions \<string><li>public \<boolean></li><li>ingredients \<array> (See ingredient list example below)</li></ul>  
| Done        | Edit recipe                          | PUT    | recipes/:id            | Optional: <ul><li>user_id \<number></li><li>user_group_id \<number></li><li>title \<string></li> <li>description \<string></li><li>time \<number> (minutes)</li><li>instructions \<string></li><li>public \<boolean></li><li>ingredients \<array> (See ingredient list example below)</li></ul> | 
| Done        | Delete recipe                        | DELETE | recipes/:id            |                        | 

### Ingredient list example
```javascript
ingredients: [
  {
    ingredient_id: 52,
    quantity: 0.235 // Referring to whatever unit that ingredient has
  }
  // more ingredients
]
```