/*=================================================
PLUTEK (PTY) LTD
MAIN JAVASCRIPT
=================================================*/

/*=========================
LOADER
=========================*/

window.addEventListener("load", function () {

    const loader = document.getElementById("loader");

    loader.style.opacity = "0";

    loader.style.visibility = "hidden";

});


/*=========================
HAMBURGER MENU
=========================*/

const hamburger = document.querySelector(".hamburger");

const navLinks = document.querySelector(".nav-links");



if(hamburger){

    hamburger.addEventListener("click", function(){

        navLinks.classList.toggle("active");

    });

}


/*=========================
CLOSE MENU WHEN LINK CLICKED
=========================*/

const menuLinks = document.querySelectorAll(".nav-links a");

menuLinks.forEach(function(link){

    link.addEventListener("click", function(){

        navLinks.classList.remove("active");

    });

});
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');

if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', function () {
        navbarCollapse.classList.toggle('show');
    });
}


/*=========================
STICKY NAVBAR
=========================*/

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", function(){

    if(window.scrollY > 80){

        navbar.classList.add("scrolled");

    }

    else{

        navbar.classList.remove("scrolled");

    }

});


/*=========================
SCROLL REVEAL
=========================*/

const revealElements = document.querySelectorAll(

".card, .stat, .why-grid div, .contact-grid div"

);

function revealOnScroll(){

    const windowHeight = window.innerHeight;

    revealElements.forEach(function(element){

        const top = element.getBoundingClientRect().top;

        if(top < windowHeight - 100){

            element.classList.add("show");

        }

    });

}

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();


/*=========================
COUNTER ANIMATION
=========================*/

const counters = document.querySelectorAll(".stat h2");

let counterStarted = false;

function animateCounters(){

    if(counterStarted){

        return;

    }

    const stats = document.querySelector(".stats");

    const statsTop = stats.getBoundingClientRect().top;

    if(statsTop < window.innerHeight - 100){

        counterStarted = true;

        counters.forEach(function(counter){

            const original = counter.innerText;

            const target = parseInt(original);

            if(isNaN(target)){

                return;

            }

            let current = 0;

            const speed = target / 100;

            const interval = setInterval(function(){

                current += speed;

                if(current >= target){

                    current = target;

                    clearInterval(interval);

                }

                counter.innerText = Math.floor(current) + "+";

            },20);

        });

    }

}

window.addEventListener("scroll", animateCounters);


/*=========================
SMOOTH BUTTON HOVER
=========================*/

const buttons = document.querySelectorAll(

".btn-primary,.btn-secondary,.quote-btn"

);

buttons.forEach(function(button){

    button.addEventListener("mouseenter", function(){

        button.style.transform = "translateY(-5px)";

    });

    button.addEventListener("mouseleave", function(){

        button.style.transform = "translateY(0px)";

    });

});


/*=========================
ACTIVE NAVIGATION
=========================*/

const sections = document.querySelectorAll("section");

window.addEventListener("scroll", function(){

    let current = "";

    sections.forEach(function(section){

        const sectionTop = section.offsetTop;

        if(pageYOffset >= sectionTop - 120){

            current = section.getAttribute("id");

        }

    });

    menuLinks.forEach(function(link){

        link.classList.remove("active-link");

        if(link.getAttribute("href") == "#" + current){

            link.classList.add("active-link");

        }

    });

});


/*=========================
WHATSAPP BUTTON PULSE
=========================*/

const whatsapp = document.querySelector(".whatsapp");

if(whatsapp){

setInterval(function(){

    whatsapp.classList.toggle("pulse");

},1000);

}


/*=========================
BACK TO TOP BUTTON
=========================*/

window.addEventListener("scroll", function(){

    if(window.scrollY > 500){

        topButton.style.display = "block";

    }

    else{

        topButton.style.display = "none";

    }

});

topButton.addEventListener("click", function(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});


/*=========================
CURRENT YEAR
=========================*/

const copyright = document.querySelector(".copyright");

if(copyright){

    copyright.innerHTML =

    "© " +

    new Date().getFullYear() +

    " PLUTEK (Pty) Ltd. All Rights Reserved.";

}