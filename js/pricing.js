/*=========================================
PLUTEK (PTY) LTD
PRICING CALCULATOR
=========================================*/

const services = {
    "5000": {
        name: "Business Website",
        price: 5000
    },

    "15000": {
        name: "eCommerce Website",
        price: 15000
    },

    "30000": {
        name: "Custom Software",
        price: 30000
    },

    "25000": {
        name: "Mobile Application",
        price: 25000
    },

    "2500": {
        name: "IT Consultation",
        price: 2500
    },

    "3500": {
        name: "Cloud Services",
        price: 3500
    },

    "4000": {
        name: "Cybersecurity",
        price: 4000
    }
};


function formatCurrency(amount){

    return "R " + amount.toLocaleString("en-ZA");

}


function calculatePrice(){

    let service =
    document.getElementById("service");

    let features =
    document.getElementById("features");

    let maintenance =
    document.getElementById("maintenance");

    let totalOutput =
    document.getElementById("total");

    let basePrice =
    Number(service.value);

    let extraFeatures =
    Number(features.value);

    let maintenancePrice =
    Number(maintenance.value);

    let featurePrice =
    extraFeatures * 1200;

    let subtotal =
    basePrice + featurePrice;

    let vat =
    subtotal * 0.15;

    let grandTotal =
    subtotal + vat + maintenancePrice;

    totalOutput.innerHTML =
    formatCurrency(grandTotal);

}


document.addEventListener("DOMContentLoaded", function(){

    calculatePrice();

});


document.getElementById("service").addEventListener("change", calculatePrice);

document.getElementById("features").addEventListener("input", calculatePrice);

document.getElementById("maintenance").addEventListener("change", calculatePrice);


/*=========================================
REQUEST QUOTE
=========================================*/

function requestQuote(){

    let service =
    document.getElementById("service");

    let features =
    document.getElementById("features");

    let maintenance =
    document.getElementById("maintenance");

    let total =
    document.getElementById("total").innerText;

    let message =
`Hello PLUTEK,

I would like to request an official quotation.

Service:
${service.options[service.selectedIndex].text}

Extra Features:
${features.value}

Maintenance:
${maintenance.options[maintenance.selectedIndex].text}

Estimated Price:
${total}

Please contact me.

Thank you.`;

    let url =
    "https://wa.me/27XXXXXXXXX?text=" +
    encodeURIComponent(message);

    window.open(url,"_blank");

}


/*=========================================
ANIMATION
=========================================*/

const calculator =
document.querySelector(".calculator");

if(calculator){

calculator.animate([

{
opacity:0,
transform:"translateY(60px)"
},

{
opacity:1,
transform:"translateY(0)"
}

],{

duration:900,
fill:"forwards"

});

}