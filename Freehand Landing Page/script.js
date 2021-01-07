//Прелоадер

document.body.classList.add("loading");

window.addEventListener("load", () => {
    let preloader = document.querySelector(".preloader");
    setTimeout(() => {
        preloader.classList.add("stopped");
        document.body.classList.remove("loading");
        scrollAnime();
    }, 1000);
});

//Открытие/закрытие меню

let header = document.querySelector(".header");

function openMenu(){
    let opener = document.querySelector(".menu__opener"),
        menu = document.querySelector(".menu"),
        links = menu.querySelectorAll(".link");

    let scrollWidth;

    let elem = document.createElement("div");//элемент подложка, перекрывающий всё содержимое, клик на который будет закрывать меню
        elem.classList = "no__menu";

    opener.addEventListener("click", () => {//открытие меню
        //танцы с бубном дабы вычислить ширину скролбара
        let div = document.createElement('div');
        div.style.overflowY = 'scroll';
        div.style.width = '50px';
        div.style.height = '50px';
        document.body.append(div);
        scrollWidth = div.offsetWidth - div.clientWidth;
        div.remove();
        //добавление отступов нужно чтобы убрать дерганье контента при появлении/скрытии скролбара
        //этого можно было и не делать, но лично меня это раздражает
        header.style = "width: calc(100% - " + scrollWidth + "px)";//поскольку header имеет position fixed
        document.body.style = "padding-right: " + scrollWidth + "px";//именно это и компенсирует недостающее место, занимаемое скроллом
        document.body.classList.add("no__scroll");//отключение скролла во время открытого меню
        document.body.appendChild(elem);
        menu.classList.remove("closed");
        links.forEach((item, index) => {//анимация появления для ссылок
            item.style = "transition: color 1s, transform 0.4s " + ((index + 3) / 10 ) + "s"; 
        });
    });

    document.addEventListener("click", (event) => {//закрытие
        if((event.target.className == "no__menu" || event.target.className == "menu__closer") && !menu.classList.contains("closed")){
            header.style = "";
            document.body.style = "";
            document.body.classList.remove("no__scroll");
            document.body.removeChild(elem);
            menu.classList.add("closed");
        }
    });
}

openMenu();

//Скрытие хэдэра при скролле вниз/показ при скролле вверх

function stickyHeader(){
    let prevScroll = 0;//предыдущее расстояние прокрутки 

    window.addEventListener("scroll", () => {
        let currScroll = window.pageYOffset;//текущее расстояние прокрутки

        if(currScroll >= header.offsetHeight){//если расстояние >= высоты хэдэра
            if(!header.classList.contains("scrolled")){//если нет класса scrolled, то добавить
                header.classList.add("hidden");//скрыть
                header.style = "transition: 0s";//так надо
                header.classList.add("scrolled");//именно этот класс задает фиксированный position
                setTimeout(() => {
                    header.style = "";//так тоже надо
                }, 100);
            }
            //Сравнение текущего скролла с предыдущим (если текущий больше старого, то произошел скролл вниз)
            currScroll > prevScroll ? header.classList.add("hidden") : header.classList.remove("hidden");
        }
        else if(currScroll <= 0){
            /*Удаление классов, возврат прежнего вида хэдэра*/
            header.classList.remove("scrolled");
            header.classList.remove("hidden");
        }

        prevScroll = currScroll;
    });
}

stickyHeader();

//Какой-то эффект для двух ссылок (просто шоб красиво)

function buttonsAnime(){
    function changeRadius(event, pos, index){
        if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))){//чтоб не работало на моб. устройствах
            /*считывание положения курсора на элементе*/ 
            let x = Math.floor(event.clientX - pos.left);
        
            if(index == 1 || index == 2){
                x = Math.floor(this.offsetWidth - (event.clientX - pos.left));
            }
        
            let y = Math.floor(event.clientY - pos.top);

            if(index == 2 || index == 3){
                y = Math.floor(this.offsetHeight - (event.clientY - pos.top));
            }
            /*стилизация уголков элемента*/
            switch(index){
                //border-radius при 4 значениях - радиус для верхнего левого, верхнего правого, нижнего правого и нижнего левого уголка
                case 0:
                    this.style = "border-radius: " + (x + y * 2) / 4 + "px 8px 8px 8px";
                    break;
                case 1:
                    this.style = "border-radius: 8px " + (x + y * 2) / 4 + "px 8px 8px";
                    break;
                case 2:
                    this.style = "border-radius: 8px 8px " + (x + y * 2) / 4 + "px 8px";
                    break;
                case 3:
                    this.style = "border-radius: 8px 8px 8px " + (x + y * 2) / 4 + "px";
                    break;
            }
        }
    }

    document.querySelectorAll(".register__button").forEach((item) => {
        item.addEventListener("mouseover", (event) => {//нахождение точки "входа"
            let pos = item.getBoundingClientRect();//получение размера элемента и его позиции

            let startX = event.clientX - pos.left;
                startY = event.clientY - pos.top;

            let halfWidth = item.offsetWidth / 2,
                halfHeight = item.offsetHeight / 2;
            /*определение, какой именно уголок нужно стилизовать*/
            if(startX <= halfWidth && startY <= halfHeight){
                item.addEventListener("mousemove", (event) => {
                    changeRadius.call(item, event, pos, 0);//будет стилизация верхнего левого угла
                });
            }
            else if(startX >= halfWidth && startY <= halfHeight){
                item.addEventListener("mousemove", (event) => {
                    changeRadius.call(item, event, pos, 1);//верхнего правого
                });
            }
            else if(startX >= halfWidth && startY >= halfHeight){//нижнего правого
                item.addEventListener("mousemove", (event) => {
                    changeRadius.call(item, event, pos, 2);
                });
            }
            else{//нижнего левого
                item.addEventListener("mousemove", (event) => {
                    changeRadius.call(item, event, pos, 3);
                });
            }
        });
        item.addEventListener("mouseout", function(){
            this.style = "transition: 0.3s";//плавный возврат в исходную форму
        });
    });
}

buttonsAnime();

//Слайдер

function swipeSlider(){
    document.querySelectorAll(".slide__img").forEach((item) => {//отключение перетаскивания изображения и вызова контекстного меню
        item.ondragstart = () => {
            return false;
        };
        item.oncontextmenu = () => {
            return false;
        };
    });

    let slides = document.querySelectorAll(".slide"),
        slideBtns = document.querySelectorAll(".arrow__control");

    let pos = slides[0].getBoundingClientRect(),
        initX, currX, dist, 
        slideWidth = slides[0].offsetWidth,
        needDist = slideWidth / 4,
        currIndex = 0,
        minDist = 10,
        isMobile = false;
    
    slideBtns[0].classList.add("no__active");

    function translateSlides(){//функция для переноса слайдов
        slides.forEach((item) => {
            item.style = "transform: translateX(-" + slideWidth * currIndex + "px); transition: 0.3s";
        });
    }

    frame.addEventListener("resize", () => {//костыль
        /*Не window, т.к. нужно учитывать появление/скрытие скроллбара (например при переключении в консоли браузера device type)*/
        /*Перерасчет значений переменных*/
        pos = slides[0].getBoundingClientRect();
        slideWidth = slides[0].offsetWidth;
        /*Сдвиг слайдов на необходимое расстояние*/
        translateSlides();
    });

    function prevSlide(){//переход к предыдущему слайду
        slideBtns[1].classList.remove("no__active");
        currIndex--;
        if(currIndex == 0){
            slideBtns[0].classList.add("no__active");
        }
       translateSlides();
    }

    function nextSlide(){//переход к следующему слайду
        slideBtns[0].classList.remove("no__active");
        currIndex++;
        if(currIndex == slides.length - 1){
            slideBtns[1].classList.add("no__active");
        }
        translateSlides();
    }

    slideBtns[0].addEventListener("click", prevSlide);
    slideBtns[1].addEventListener("click", nextSlide);

    function getPos(event){//получение координат курсора
        try{//обращение к .touches на десктопе вызовет ошибку
            isMobile = true;//т.к. touches ошибку не вызвало, значит это мобильное устройство
            return event.touches[0].clientX - pos.left;
        }
        catch(error){//которую мы благополучно отследим
            isMobile = false;//touches вызвало ошибку, это десктоп 
            return event.clientX - pos.left;
        }
    }

    function swipeStart(event){//начало свайпа
        initX = getPos(event);//расчет начальной координаты X
    }

    function swipeProcess(event){//сам свайп
        currX = getPos(event);//расчет текущей координаты X
        dist = currX - initX;//расчет дистанции
        if(Math.abs(dist) > slideWidth){//так надо
            return;
        }
        else if(isMobile && Math.abs(dist) < minDist){
            //если пользователь прокрутил меньше установленного минимального значения, то слайдер не срабатывает
            //необходимо чтобы при скролле слайдер не активировался при каждом нажатии, к примеру, когда пользователь хочет просто пролистать страницу
            return;
        }
        else{
            if(isMobile){//на мобильных устройствах во время прокрутки слайдера отключить скролл страницы
                document.body.classList.add("no__scroll");
            }
            slides.forEach((item) => {
                if((dist > 0 && currIndex == 0) || (dist < 0 && currIndex == (slides.length - 1))){//когда листаем туда, где слайдов нет
                    item.style = "transform: translateX(" + (dist / 20 - slideWidth * currIndex) + "px)";
                }
                else{//когда листаем где слайды есть
                    item.style = "transform: translateX(" + (dist - slideWidth * currIndex) + "px)";
                }
            });
        }
    }

    function swipeEnd(){//окончание свайпа
        setTimeout(() => {//через установленное время можно будет опять скроллить сайт
            document.body.classList.remove("no__scroll");
        }, 300);

        if(dist >= needDist && currIndex != 0){//если пользователь пролистал влево
            currIndex--;
        }
        else if(-dist >= needDist && currIndex != slides.length - 1){//есои пользователь пролистал вправо
            currIndex++;
        }

        translateSlides();

        if(currIndex == 0){//если текущий индекс равен нулю, кнопка пролистывания к предыдущему слайду становится неактивной
            slideBtns[0].classList.add("no__active");
        }
        else if(currIndex == slides.length - 1){//если текущий индекс равен количеству элементов - 1, то кнопка пролистывания к следующему слайду становится неактивной
            slideBtns[1].classList.add("no__active");
        }
        else{//иначе вернуть всем кнопкам исходный вид
            slideBtns.forEach((item) => {
                item.classList.remove("no__active");
            });
        }

        dist = 0;//необходимо, чтобы при следующем свайпе дистанция расчитывалась заново с нуля
    }

    slides.forEach((item) => {//навешивание событий
        item.addEventListener("touchstart", swipeStart);
        item.addEventListener("mousedown", swipeStart);
        item.addEventListener("touchmove", swipeProcess);
        item.addEventListener("mousedown", () => {
            item.addEventListener("mousemove", swipeProcess);
        });
        item.addEventListener("touchend", swipeEnd);
        item.addEventListener("touchcansel", swipeEnd);
        item.addEventListener("mouseup", swipeEnd);
        item.addEventListener("mouseup", () => {
            item.removeEventListener("mousemove", swipeProcess);
        });
    });

    let timer;

    function detectScroll(){//функция, которая будет запрещать свайп при скролле страницы на мобильных устройствах
        clearTimeout(timer);
        timer = setTimeout(() => {
            slides.forEach((item) => {
                item.addEventListener("touchmove", swipeProcess);//и возвращать возможность скроллить через заданное время
            });
        }, 300);
        slides.forEach((item) => {
            item.removeEventListener("touchmove", swipeProcess);
        });
    }

    window.addEventListener("scroll", detectScroll);
}

swipeSlider();

//Анимации при скролле

function scrollAnime(){
    let scrollItems = document.querySelectorAll(".invisible"),
        screenPos = window.innerHeight / 1.08,
        scrollPos = [];

    scrollItems.forEach((item, index) => {
        scrollPos[index] = item.getBoundingClientRect().top;

        if(scrollPos[index] < screenPos){
            item.classList.remove("invisible");
        }
    });
}

window.addEventListener("scroll", scrollAnime);
window.addEventListener("resize", scrollAnime);








