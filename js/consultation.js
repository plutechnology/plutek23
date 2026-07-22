/*==================================================
PLUTEK (PTY) LTD
CONSULTATION.JS
==================================================*/

function sendConsultation() {

    let name = document.getElementById("name").value.trim();
    let company = document.getElementById("company").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let service = document.getElementById("service").value;
    let budget = document.getElementById("budget").value;
    let meeting = document.getElementById("meeting").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let description = document.getElementById("description").value.trim();

    if (name === "" || email === "") {
        alert("Please enter your name and email address.");
        return;
    }

    let message =
`*NEW CONSULTATION REQUEST*

Name:
${name}

Company:
${company}

Email:
${email}

Phone:
${phone}

Service Required:
${service}

Estimated Budget:
${budget}

Meeting Preference:
${meeting}

Preferred Date:
${date}

Preferred Time:
${time}

Project Description:
${description}`;

    const whatsappNumber = "27XXXXXXXXX";

    const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(message);

    window.open(whatsappURL, "_blank");

    alert("Thank you! Your consultation request is ready to send via WhatsApp.");

    document.getElementById("consultationForm").reset();
}


/*=================================
DATE VALIDATION
=================================*/

const dateField = document.getElementById("date");

if (dateField) {

    let today = new Date();

    let year = today.getFullYear();

    let month = String(today.getMonth() + 1).padStart(2, "0");

    let day = String(today.getDate()).padStart(2, "0");

    dateField.min = year + "-" + month + "-" + day;

}


/*=================================
FORM ANIMATION
=================================*/

const form = document.querySelector(".calculator");

if (form) {

    form.animate(

        [
            {
                opacity: 0,
                transform: "translateY(50px)"
            },
            {
                opacity: 1,
                transform: "translateY(0)"
            }
        ],

        {
            duration: 800,
            fill: "forwards"
        }

    );

}


/*=================================
INPUT HIGHLIGHT
=================================*/

const inputs = document.querySelectorAll(

"input, textarea, select"

);

inputs.forEach(function(input){

    input.addEventListener("focus", function(){

        input.style.borderColor = "#00bfff";

    });

    input.addEventListener("blur", function(){

        input.style.borderColor = "rgba(255,255,255,.15)";

    });

});


/*=================================
CHARACTER COUNTER
=================================*/

const descriptionBox = document.getElementById("description");

if(descriptionBox){

    const counter = document.createElement("small");

    counter.style.display = "block";
    counter.style.marginTop = "10px";
    counter.style.color = "#00bfff";

    descriptionBox.parentNode.insertBefore(counter, descriptionBox.nextSibling);

    descriptionBox.addEventListener("input", function(){

        counter.innerHTML =
        descriptionBox.value.length +
        " / 1000 characters";

    });

}