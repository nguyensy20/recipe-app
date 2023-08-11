const searchText = document.getElementById("searchText");
const searchBtn = document.getElementById("search-btn");
const mealsEl = document.getElementById("meals");
const favMealsCtn = document.getElementById("favMeals");
const popupCtn = document.getElementById("popup-container");

getRandomMeal();
fetchFavMeals()

async function getMealByTerm(meal) {
   const resp = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s=" + meal
   );
   const respData = await resp.json();
   const meals = respData.meals;

   return meals;
}

//Lấy meal bằng id
async function getMealById(id) {
   const resp = await fetch(
      "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
   );

   const respData = await resp.json();
   const meal = respData.meals[0];

   return meal;
}


async function getRandomMeal() {
   const resp = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
   );

   const respData = await resp.json();
   const meal = respData.meals[0];

   addMeal(meal, true);
}

function addMealLS(mealId) {
   const mealIds = getMealLS();
   localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
   const mealIds = getMealLS();

   localStorage.setItem(
       "mealIds",
       JSON.stringify(mealIds.filter((id) => id !== mealId))
   );
}

function getMealLS() {
   const mealIds = JSON.parse(localStorage.getItem("mealIds"));
   return mealIds === null ? [] : mealIds;
}

function addMeal(mealData, random = false) {
   //Tạo thẻ  random meal 
   const meal = document.createElement("div");

   if (random) meal.classList.add("random");
   meal.classList.add("meal");
   meal.innerHTML = `
      <div class="meal-header">
         ${random ? `
               <p class="tag">
                     Random recipe
               </p>
            ` : ""
      }
         <img src="${mealData.strMealThumb}"
          alt="${mealData.strMeal}"/>
      </div>
      <div class="meal-body">
         <h4>${mealData.strMeal}</h4>
         <button class="fav-btn">
               <i class="fas fa-heart"></i>
         </button>
      </div>`

   ///Lấy ra nút fav-btn từ meal-body 
   const favBtn = meal.querySelector(".meal-body .fav-btn");

   //Thêm sự kiện kích hoạt để show popup 

   favBtn.addEventListener("click", () => {
      if (favBtn.classList.contains("active")) {
         console.log("Bot")
         removeMealLS(mealData.idMeal);
         favBtn.classList.remove("active");
      } else {
         console.log("Them")
         addMealLS(mealData.idMeal);
         favBtn.classList.add("active");
     }
     fetchFavMeals()
   });
   const imgBtn = meal.querySelector(".meal-header img");
   //Thêm thẻ random meal vào mealsEL 
   imgBtn.addEventListener('click', () => {
      showPopup(mealData);
   });
   mealsEl.appendChild(meal);
}

function showPopup(meal) {
   const popup = document.createElement("div");

   popup.classList.add("popup");
   popupCtn.classList.add("active");
   popup.innerHTML = `
      <div class="header">
         <h3 class="name">${meal.strMeal}</h3>
         <button class="close" id="close">
            <i class="fas fa-times"></i>
         </button>
      </div>
      <div class="popup-body">
         <img src="${meal.strMealThumb}" alt="">
         <p>${meal.strInstructions}
         </p>
      </div>
   `
   const closeBtn = popup.querySelector(".header .close");
   closeBtn.addEventListener('click', () => {
      popupCtn.removeChild(popup);
      popupCtn.classList.remove("active");
   });

   popupCtn.appendChild(popup);
}

searchBtn.addEventListener('click', async () => {
   mealsEl.innerHTML = ``;
   var mealString = searchText.value;
   var meals = await getMealByTerm(mealString);
   meals.forEach(meal => {
      // console.log(meal);
      addMeal(meal);
   });


})

async function testAnything() {
   const meals = await getMealByTerm("chocolate");
   // var meal = mealsData[0];
}

function fetchFavMeals() {
   favMealsCtn.innerHTML =''
   const mealIds = getMealLS();
   mealIds.forEach(async (mealId) => {
      const mealData = await getMealById(mealId)
      const meal = document.createElement("div");
      meal.classList.add("fav-meal")
      meal.innerHTML = `
         <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
            <button class="delBtn"><i class="fas fa-times"></i></button>
      `
      const clsBtn = meal.querySelector(".delBtn")
      clsBtn.addEventListener('click', () => {
         console.log("Xoa khoi fav")
         removeMealLS(mealData.idMeal)
         fetchFavMeals()
      })
      const imgBtn = meal.querySelector("img");
      //Thêm thẻ random meal vào mealsEL 
      imgBtn.addEventListener('click', () => {
         showPopup(mealData);
      });
      favMealsCtn.appendChild(meal)
   })
}
// testAnything();
