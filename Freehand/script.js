//Открытие/закрытие меню

function openMenu(){
    let opener = document.querySelector(".menu__opener"),
    menu = document.querySelector(".menu"),
    links = menu.querySelectorAll(".link");

    let elem = document.createElement("div");//элемент подложка, перекрывающий всё содержимое, клик на который будет закрывать меню
    elem.classList = "no__menu";

    opener.addEventListener("click", () => {//открытие меню
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
    let header = document.querySelector(".header");

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
    if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))){//чтоб не работало на моб. устройствах
        function changeRadius(event, pos, index){
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
    slideBtns = document.querySelectorAll(".arrow__control"),
    pos = slides[0].getBoundingClientRect().left,
    initX, currX, dist, 
    translateVal = 0,
    slideWidth = slides[0].offsetWidth,
    oldIndex,
    currIndex = 0;
    
    slideBtns[0].style = "opacity: 0.7; pointer-events: none";

    window.addEventListener("resize", () => {
        pos = slides[0].getBoundingClientRect().left;
        slideWidth = slides[0].offsetWidth;
        swipeEnd();
    });

    function prevSlide(){
        slideBtns[1].style = "";
        currIndex--;
        slides.forEach((item) => {
            item.style = "transform: translateX(-" + currIndex * slideWidth + "px); transition: 0.3s";
            translateVal = Number(item.style.transform.match(/(-[0-9]|[0-9])+/ig));
        });
        if(currIndex == 0){
            slideBtns[0].style = "opacity: 0.7; pointer-events: none";
        }
    }

    function nextSlide(){
        slideBtns[0].style = "";
        currIndex++;
        slides.forEach((item) => {
            item.style = "transform: translateX(-" + currIndex * slideWidth + "px); transition: 0.3s";
            translateVal = Number(item.style.transform.match(/(-[0-9]|[0-9])+/ig));
        });
        if(currIndex == slides.length - 1){
            slideBtns[1].style = "opacity: 0.7; pointer-events: none";
        }
    }

    slideBtns[0].addEventListener("click", prevSlide);
    slideBtns[1].addEventListener("click", nextSlide);

    function getPos(event){
        try{
            return event.touches[0].clientX - pos;
        }
        catch(error){
            return event.clientX - pos;
        }
    }

    function swipeStart(event){
        initX = getPos(event);
    }

    function swipeProcess(event){
        oldIndex = undefined;
        currX = getPos(event);
        dist = currX - initX;
        if(Math.abs(dist) >= slideWidth){
            return;
        }
        slides.forEach((item) => {
            if((dist > 0 && currIndex == 0) || (dist < 0 && currIndex == (slides.length - 1))){
                item.style = "transform: translateX(" + (dist / 10 + translateVal) + "px)";
            }
            else{
                item.style = "transform: translateX(" + (dist + translateVal) + "px)";
            }
        });
    }

    function swipeEnd(){
        oldIndex = undefined;
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
            slideBtns[0].style = "opacity: 0.7; pointer-events: none";
        }
        else if(currIndex == slides.length - 1){
            slideBtns[1].style = "opacity: 0.7; pointer-events: none";
        }
        else{
            slideBtns.forEach((item) => {
                item.style = "";
            });
        }
    }

    slides.forEach((item) => {
        item.addEventListener("touchstart", swipeStart);
        item.addEventListener("mousedown", swipeStart);
        item.addEventListener("touchmove", swipeProcess);
        item.addEventListener("mousedown", () => {
            item.addEventListener("mousemove", swipeProcess);
        });
        item.addEventListener("touchend", swipeEnd);
        item.addEventListener("mouseup", swipeEnd);
        item.addEventListener("mouseup", () => {
            item.removeEventListener("mousemove", swipeProcess);
        });
    });
}

swipeSlider();







