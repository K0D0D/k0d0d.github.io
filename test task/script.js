/*Теория

1) let - директива для объявления локальной переменной и её инициализации.
2) function name(arg){body} - объявление функции вида function declaration, где name - название ф-ции, arg - аргумент(ы), body - тело ф-ции.
3) return - возвращаемое значение выполнения.
4) name(arg) - вызов ф-ции с именем name и передача в неё аргумента(ов) arg.
5) () => {} - стрелочная ф-ция, в отличии от других видов, не имеет собственного названия и контекста this.
6) let arr = [] - инициализация массива. 
   let arr = [true, "yellow", 8] - инициализация элементов массива.
   arr[index] - обращение к элементу массива под указанным индексом.
7) let obj = {} - инициализация переменной с типом object.
let obj = {
    key1: value,
    key2: value,
    keyN: value
} - создание объекта, в котором key1, key2, keyN - свойства (ключи объекта), value - значение. Перечисление свойств идет через запятую. Наличие запятой у последнего свойства называется плавающая запятая.
obj.key1 - обращение к свойству key1 элемента obj, при котором будет возвращено значение value.
8) document - объект для получения содержимого из DOM.
9) .querySelector(), .querySelectorAll() - получение элементов из NodeList с указанным параметром (класс, тег, айди).
10) for( ; ; ) - цикл, в котором первое выражение инициализация переменной, второе - условие, третье - изменение счетчика (инкремент, декремент, и т.д.).
11) .forEach((item, index) => {}) - цикл (метод массива), выполняющий однократно указанную ф-цию для каждого эл-та item. item выступает в роле элемента массива, index - индекс текущего эл-та.
12) .addEventListener("тип события", имя ф-ции, хар-ки объекта) - навешивает обработчик события на указанный элемент.
13) setTimeout(function, delay) - асинхронный таймер однократного срабатывания указанной ф-ции function через delay мс (1000мс = 1с). 
14) .classList - свойство DOM-объектов, возвращаемое псевдомассив DOMTokenList, в котором указаны все классы элемента. В объекто-ориентированном представлении является аксессором (get).
15) свойства аксессоры - свойства объектов, в отличии от свойств-данных, являются ф-циями, которые либо записывают значение свойства объекта (set), либо получают его (get).
При этом, обращение к ним происходит как с обычными свойствами объекта (не obj.getterName() или obj.setterName(), а obj.getterName и obj.setterName соответственно). Так же как и свойства-данные имеют 
дескрипторы (свойства доступа), но об этом потом.
16) .classList.add("class") - добавление класса указанному эл-ту, .classList.remove("class") - удаление класса указанного эл-та.
17) .createElement("tag") - создание элемента DOM. При этом доступна запись свойств (классы, контент, и т.д.).
18) .innerText - свойство DOM элементов, отвечающее за текстовый контент внутри.
19) parent.appendChild(child) - добавление дочернего эл-та child в родителя parent.
20) .toUpperCase() - метод строки, преобразующий всё в верхний регистр.
21) .trim() - метод строки, убирающий пробелы по её краям.

*/

document.querySelectorAll(".slide__img").forEach((item) => {
    item.ondragstart = () => {//запрет на перетаскивание изображений (это должно было быть для свайп-слайдера, но с ним кода было бы намного больше, и расписывать его целиком как-то такое)
        return false;
    };
});

/*Взаимодействие с кнопкой покупки, корзиной и суммарной стоимостью*/

function addToCart(index){//добавление элементов в корзину + расчет суммарной стоимости
    if(cartSize.innerText == "99"){//если текст элемента cartSize равняется "99", т.е. если в корзине 99 элементов
        let message = document.createElement("div");//создание элемента с тегом div
        message.classList = "oversize__msg";//присвоение ему класса
        message.innerText = "Корзина переполнена!";//установка его текстового контента
        addIcon[index].appendChild(message);//вставка элемента в элемент addIcon под индексом index
        setTimeout(() => {//таймер на 1000мс, удоляющий элемент из родительского addIcon
            addIcon[index].removeChild(message);
        }, 1000);
        return;//пустой return используется для окончания выполнения ф-ции, т.е. всё что находится ниже return выполнено не будет
    }
    itemParent[index].classList.add("refresh");//добавление элементу itemParent под индексом index класса refresh, который запускает анимацию (см. в style.css 458 строка)
    addIcon[index].style = "pointer-events: none";//отключение событий pointer у элемента addIcon под индексом index
    setTimeout(() => {
        itemParent[index].classList.remove("refresh");//удаление класса, завершение анимации
        addIcon[index].style = "";//возврат событий pointer
    }, 1500);//задержка 1.5 сек
    cartSize.innerText++;//инкремент (+1) текстового контента (если innerText равняется "3", то innerText++ сделает "4"). При этом не происходит конкатинация.
    priceCounter += Number(itemsPrice[index].innerText);//рассчет суммарной стоимости с помощью класса Number и оператора добавления с присвоением (+=)
    totalPrice.innerText = priceCounter;//свойство innerText элемента totalPrice приравнять к значению переменной priceCounter
    itemsAmount[index].innerText++;//инкремент innerText элемента itemsAmount 
}

function delFromCart(index){//удаление элементов из корзины + вычитание из суммарной стоимости
    priceCounter = Number(totalPrice.innerText - itemsAmount[index].innerText * itemsPrice[index].innerText);//вычитание 
    totalPrice.innerText = priceCounter;
    cartSize.innerText = Number(cartSize.innerText - itemsAmount[index].innerText);
    itemsAmount[index].innerText = 0;
    checkOuts[index].classList.remove("clicked");//у элемента массива checkOuts под индексом index удаляется класс clicked (см. в style.css 369 строка)
    alwaysShowDisc[index] = false;//постоянный показ скидок отменяется
}

let discounts = document.querySelectorAll(".discount");

let alwaysShowDisc = [];//создание массива, эл-ты которого будут определять, постоянно отображаются скидки, либо же нет

for(let i = 0; i < discounts.length; i++){//перебор элементов массива и присвоение всем значения false
    alwaysShowDisc[i] = false;
}

let checkOuts = document.querySelectorAll(".checkout");

document.querySelectorAll(".start").forEach((item, index) => {//перебор элементов с классом start
    item.addEventListener("click", () => {//ивент при нажатии 
        if(cartSize.innerText == "99"){//если размер корзины равен 99, выполнение ф-ции заканчивается вызовом ф-ции addToCart 
            addToCart(index);
            return;
        }
        alwaysShowDisc[index] = true;//если пользователь нажал на кнопку, скидки в соответствующей карточке отображаются постоянно
        checkOuts[index].classList.add("clicked");//элементу массива checkOuts под индексом index добавляется класс clicked
        addToCart(index);//вызов функции addToCart, index в качестве аргумента
    });

    /*Имитация hover*/

    item.addEventListener("mouseover", () => {//ивент когда мышь находится над элементом
        discounts[index].style.opacity = "1";//прозрачность блока с классом discount равняется 1 (полная непрозрачность)
    });
    item.addEventListener("mouseout", () => {//ивент когда мышь покинула элемент
        if(!alwaysShowDisc[index]){//если alwaysShowDisc[index] != true
            discounts[index].style.opacity = "0";//прозрачность блока с классом discount равняется 0 (полная прозрачность)
        }
    });
});

/*Инициализация всех необходимых переменных*/

let cartSize = document.querySelector(".counter"),
    addIcon = document.querySelectorAll(".add"),
    delIcon = document.querySelectorAll(".del"),
    itemsAmount = document.querySelectorAll(".num"),
    itemParent = document.querySelectorAll(".size"),
    itemsPrice = document.querySelectorAll(".price"),
    totalPrice = document.querySelector(".total__price");

let priceCounter = 0;

let timerMsg;

/*Навешивание событий*/

addIcon.forEach((item, index) => {
    item.addEventListener("click", () => {//при нажатии на иконку "добавить", выполняется стрелочная ф-ция, которая вызывает ф-цию addToCart с аргументом index
        addToCart(index);
    });
});

delIcon.forEach((item, index) => {
    item.addEventListener("click", () => {//при нажатии на иконку "удалить", выполняется стрелочная ф-ция, которая вызывает ф-цию delFormCart с аргументом index
        delFromCart(index);
    });
});

/*Слайдер*/

function slideSwiper(index1, index2){
    let cards = document.querySelectorAll(".card"),//переменная, отвечающая за коллекцию элементов с классом card
        current;//переменная, отвечающая за номер текущего слайда

    let slider = {//создание объекта slider
        miniItems: cards[index1].querySelectorAll(".item"),//миниатюры
        slides: cards[index1].querySelectorAll(".slide"),//слайды
        dots: cards[index1].querySelectorAll(".dot"),//точки внизу
        //При этом поиск элементов происходит в элементе из массива cards под индексом index
        get searchCurrent(){//геттер, находящий номер текущего слайда, путем поиска класса 
            for(let i = 0; i < this.dots.length; i++){
                if(this.dots[i].classList.contains("current__dot")){//если у точки под индексом i есть класс current__dot, то номер текущего слайда = i
                    current = i;
                }
            }
        },
    };

    slider.searchCurrent;//обращение к геттеру, нахождение значения current

    for(let i = 0; i < slider.slides.length; i++){//перебор массива slides объекта slider
        slider.slides[i].style = "transform: translateX(-" + 100 * index2 + "%)";//перенос каждого элемента массива slides по оси Х 
        slider.dots[current].classList.remove("current__dot");//у старой точки, переключающей слайд, удаляется класс current__dot
        slider.miniItems[current].classList.remove("current__item");//у старой миниатюры удаляется класс current__item
        current = index2;//присвоение current нового значения index2
        slider.dots[current].classList.add("current__dot");//новой точке добавляется класс current__dot
        slider.miniItems[current].classList.add("current__item");//новой миниатюре добавляется класс current__item
    }
}

let dotsParent = document.querySelectorAll(".dots");//родителем элементов .dot является блок .dots

for(let i = 0; i < dotsParent.length; i++){
    let dots = dotsParent[i].querySelectorAll(".dot");//поиск элементов с классом dot в dotsParent под индексом i
    dots[0].classList.add("current__dot");//добавление первому (отсчет идет с нуля) элементу с классом dot класса current__dot (чтоб не делать это вручную через html + корректной работы слайдера)
    dots.forEach((item, index) => {
        item.addEventListener("click", () => {//при клике на точку, выполняется стрелочная ф-ция, которая вызывает ф-цию slideSwiper с аргументами i (index1) и index (index2)
            slideSwiper(i, index);
        });
    });
}

let miniParent = document.querySelectorAll(".mini");//родителем элементов .item является блок .mini

for(let i = 0; i < miniParent.length; i++){
    let miniChild = miniParent[i].querySelectorAll(".item");//поиск элементов с классом .item в miniParent под индексом i
    miniChild[0].classList.add("current__item");//добавление первому элементу с классом item класса current__item (по той же причине, что и с .dot)
    miniChild.forEach((item, index) => {
        item.addEventListener("click", () => {//при клике на точку, выполняется стрелочная ф-ция, которая вызывает ф-цию slideSwiper с аргументами i (index1) и index (index2)
            slideSwiper(i, index);
        });
    });
}

/*Поиск по сайту*/

let search = document.querySelector(".search"),
    itemsNames = document.querySelectorAll(".name"),
    resultsContainer = document.querySelector(".search__results");

itemsNames.forEach((item) => {
    let listItem = document.createElement("li");//создание элемента с тегом li
    listItem.innerText = item.innerText;//присвоение ему текстового контента текущего item
    listItem.classList = "result hide";//добавление класса result hide (см в style.css 77 строка)
    resultsContainer.appendChild(listItem);//вставка элемента
});

let listItems = document.querySelectorAll(".result");

search.addEventListener("input", function(){
    let val = this.value.toUpperCase().trim();//иницилизация переменной, отвечающей за параметр value инпута с классом .search
    if(val != ""){//если значение переменной не пустая строка
        listItems.forEach((item) => {
            if(item.innerText.toUpperCase().search(val) != -1){//если совпадения найдены
                item.classList.remove("hide");//удаление у текущего item класса hide
            }
            else{
                item.classList.add("hide");//иначе добавить
            }
        });
    }
    else{
        listItems.forEach((item) => {
            item.classList.add("hide");//если всё таки пользователь ничего не ввел, всем item присвоить класс hide
        });
    }
});

listItems.forEach((item) => {
    item.addEventListener("click", () => {//при клике на item
        search.value = item.innerText;//свойство value инпута = текстовый контент текущего элемента
        listItems.forEach((item) => {
            item.classList.add("hide");//всем item добавить класс hide
        });
    });
});

search.addEventListener("focus", () => {//при фокусе на инпут
    resultsContainer.classList.remove("noactive");//удалить класс noactive элемента с классом search__results (см. style.css 64 строка)
});

search.addEventListener("blur", () => {//при потере фокуса (пользователь нажал вне области инпута)
    setTimeout(() => {
        resultsContainer.classList.add("noactive");//спустя 100 мс (чтобы дать время нажать на  li), добавляется класс noactive
    }, 100);
});









    




















