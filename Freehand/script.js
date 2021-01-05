//Открытие/закрытие меню

let header = document.querySelector(".header");

function openMenu(){
    let opener = document.querySelector(".menu__opener"),
        menu = document.querySelector(".menu"),
        links = menu.querySelectorAll(".link");

    let elem = document.createElement("div");//элемент подложка, перекрывающий всё содержимое, клик на который будет закрывать меню
        elem.classList = "no__menu";

    let scrollWidth;

    opener.addEventListener("click", () => {//открытие меню
        let div = document.createElement('div');
        div.style.overflowY = 'scroll';
        div.style.width = '50px';
        div.style.height = '50px';
        document.body.append(div);
        scrollWidth = div.offsetWidth - div.clientWidth;
        div.remove();
        header.style = "width: calc(100% - " + scrollWidth + "px)";
        document.body.style = "padding-right: " + scrollWidth + "px";
        document.body.classList.add("no__scroll");//отключение скролла во время открытого меню
        document.body.appendChild(elem);
        menu.classList.remove("closed");
        links.forEach((item, index) => {//анимация появления для ссылок
            item.style = "transform: translateX(0); transition: 0.4s " + ((index + 3) / 10 ) + "s"; 
            setTimeout(() => {
                item.style.transition = "";
            }, 1000);
        });
    });

    document.addEventListener("click", (event) => {//закрытие
        if((event.target.className == "no__menu" || event.target.className == "menu__closer") && !menu.classList.contains("closed")){
            header.style = "";
            document.body.style = "";
            document.body.classList.remove("no__scroll");
            document.body.removeChild(elem);
            menu.classList.add("closed");
            links.forEach((item) => {
                item.style = "transition: transform 1s"; 
            });
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
        item.addEventListener("mouseover", (event) => {
            let pos = item.getBoundingClientRect();//получение размера элемента и его позиции

            /*нахождение точки "входа"*/
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
    document.querySelectorAll(".slide__img").forEach((item) => {
        item.ondragstart = () => {
            return false;
        };
    });

    let slides = document.querySelectorAll(".slide"),
        slideBtns = document.querySelectorAll(".arrow__control");

    let pos = slides[0].getBoundingClientRect(),
        initX, currX, dist, 
        translateVal = 0,
        slideWidth = pos.width,
        oldIndex,
        currIndex = 0,
        minDist = 10,
        isCroll = false;
    
    slideBtns[0].classList.add("no__active");

    frame.addEventListener("resize", () => {//костыль
        /*Не window, т.к. нужно учитывать появление/скрытие скроллбара (например при переключении в консоли браузера device type)*/
        pos = slides[0].getBoundingClientRect();
        slideWidth = pos.width;
        translateVal = -(slideWidth * currIndex);
        slides.forEach((item) => {
            item.style = "transform: translateX(" + translateVal + "px)";
        });
    });

    function prevSlide(){
        slideBtns[1].classList.remove("no__active");
        currIndex--;
        if(currIndex == 0){
            slideBtns[0].classList.add("no__active");
        }
        slides.forEach((item) => {
            item.style = "transform: translateX(-" + currIndex * slideWidth + "px); transition: 0.3s";
            translateVal = Number(item.style.transform.match(/(-[0-9]|[0-9])+/ig));
        });
    }

    function nextSlide(){
        slideBtns[0].classList.remove("no__active");
        currIndex++;
        if(currIndex == slides.length - 1){
            slideBtns[1].classList.add("no__active");
        }
        slides.forEach((item) => {
            item.style = "transform: translateX(-" + currIndex * slideWidth + "px); transition: 0.3s";
            translateVal = Number(item.style.transform.match(/(-[0-9]|[0-9])+/ig));
        });
    }

    slideBtns[0].addEventListener("click", prevSlide);
    slideBtns[1].addEventListener("click", nextSlide);

    function getPos(event){
        try{
            return event.touches[0].clientX - pos.left;
        }
        catch(error){
            return event.clientX - pos.left;
        }
    }

    function swipeStart(event){
        initX = getPos(event);
    }

    function swipeProcess(event){
        oldIndex = undefined;
        currX = getPos(event);
        dist = currX - initX;
        console.log("currX = " + currX);
        if(Math.abs(dist) <= minDist || Math.abs(dist) >= slideWidth){
            return;
        }
        else{
            console.log("dist2 = " + dist);
            console.log("currX2 = " + currX);
            document.body.classList.add("no__scroll");
            slides.forEach((item) => {
                if((dist > 0 && currIndex == 0) || (dist < 0 && currIndex == (slides.length - 1))){
                    item.style = "transform: translateX(" + (dist / 40 + translateVal) + "px)";
                }
                else{
                    item.style = "transform: translateX(" + (dist + translateVal) + "px)";
                }
            });
        }
    }

    function swipeEnd(){
        oldIndex = undefined;
        document.body.classList.remove("no__scroll");
        slides.forEach((item) => {
            item.style.transition = "0.3s";
            if(dist >= slideWidth / 3 && currIndex != 0){
                if(currIndex != oldIndex){
                    currIndex--;
                    oldIndex = currIndex;
                }
                item.style.transform = "translateX(-" + currIndex * slideWidth + "px)";
            }
            else if(-dist >= slideWidth / 3){
                if(currIndex != oldIndex && currIndex != slides.length - 1){
                    currIndex++;
                    oldIndex = currIndex;
                }
                item.style.transform = "translateX(-" + currIndex * slideWidth + "px)";
            }
            else{
                item.style.transform = "translateX(" + translateVal + "px)";
            }
            translateVal = Number(item.style.transform.match(/(-[0-9]|[0-9])+/ig));
        });
        if(currIndex == 0){
            slideBtns[0].classList.add("no__active");
        }
        else if(currIndex == slides.length - 1){
            slideBtns[1].classList.add("no__active");
        }
        else{
            slideBtns.forEach((item) => {
                item.classList.remove("no__active");
            });
        }
        dist = undefined;
    }

    slides.forEach((item) => {
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
}

swipeSlider();








