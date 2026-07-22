/*==================================================
PLUTEK (PTY) LTD
CONTACT.JS
==================================================*/

function sendMessage() {

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (fullName === "" || email === "" || message === "") {
        alert("Please complete all required fields.");
        return;
    }

    const whatsappNumber = "27XXXXXXXXX";

    const whatsappMessage =
`*NEW WEBSITE ENQUIRY*

Name:
${fullName}

Email:
${email}

Phone:
${phone}

Subject:
${subject}

Message:
${message}`;

    const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(whatsappMessage);

    window.open(whatsappURL, "_blank");

    alert("Thank you! Your message has been prepared for WhatsApp.");

    document.getElementById("contactForm").reset();

}


/*=========================================
EMAIL VALIDATION
=========================================*/

const emailInput = document.getElementById("email");

if(emailInput){

emailInput.addEventListener("blur", function(){

    const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(emailInput.value !== "" &&
       !emailPattern.test(emailInput.value)){

        alert("Please enter a valid email address.");

        emailInput.focus();

    }

});

}


/*=========================================
CHARACTER COUNTER
=========================================*/

const messageBox =
document.getElementById("message");

if(messageBox){

const counter =
document.createElement("small");

counter.style.display="block";
counter.style.marginTop="10px";
counter.style.color="#00bfff";

messageBox.parentNode.insertBefore(
counter,
messageBox.nextSibling
);

messageBox.addEventListener("input",function(){

counter.innerHTML =
messageBox.value.length +
" / 1000 characters";

});

}


/*=========================================
FORM ANIMATION
=========================================*/

const form =
document.querySelector(".calculator");

if(form){

form.animate([

{
opacity:0,
transform:"translateY(50px)"
},

{
opacity:1,
transform:"translateY(0)"
}

],{

duration:800,
fill:"forwards"

});

}


/*=========================================
INPUT HIGHLIGHT
=========================================*/

const fields =
document.querySelectorAll(

"input, textarea"

);

fields.forEach(function(field){

field.addEventListener("focus",function(){

field.style.borderColor="#00bfff";

});

field.addEventListener("blur",function(){

field.style.borderColor=
"rgba(255,255,255,.15)";

});

});


/*=========================================
ENTER KEY SUBMIT
=========================================*/

document.addEventListener("keydown", function(event){

if(event.key === "Enter"){

const active =
document.activeElement;

if(active.tagName !== "TEXTAREA"){

event.preventDefault();

sendMessage();

}

}

});


/*=========================================
AUTO RESIZE TEXTAREA
=========================================*/

if(messageBox){

messageBox.addEventListener("input", function(){

this.style.height = "auto";

this.style.height =
this.scrollHeight + "px";

});

}