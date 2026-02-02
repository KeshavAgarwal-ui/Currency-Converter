let CURRENCY_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";
let IMAGE_URL = "https://flagsapi.com"
let dropdowns = document.querySelectorAll(".dropdown select");
let fromImage = document.querySelector(".from img");
let toImage = document.querySelector(".to img");
let msg = document.querySelector(".msg");
let fromAmount = document.querySelector("#fromAmount");
let toAmount = document.querySelector("#toAmount");
let submit = document.querySelector("#submit");
let form = document.querySelector("#form");
let i = document.querySelector("i");

form.addEventListener('submit',(e)=>{
    e.preventDefault();
})

const updateFlag = (element, imgTag) => {
    let countryCode = countryList[element.value];
    let newSrc = IMAGE_URL + `/${countryCode}/flat/64.png`;
    imgTag.src = newSrc;
}

const getCurrency = async (fromCode,toCode) =>{
    let currency = await fetch(CURRENCY_URL + `${fromCode}.json`);
    let currencyData = await currency.json();
    let rate = currencyData[fromCode][toCode];
    return rate;
};

(async ()=>{
    let rate = await getCurrency('usd','inr');
    msg.innerText = `1 USD = ${rate} INR`;
    toAmount.value = rate;
})();

const calculate = async(fromCode, toCode, amount)=>{
    let rate = await getCurrency(fromCode.toLowerCase(),toCode.toLowerCase());
    if(amount == undefined){
        amount = 1;
        msg.innerText = `${amount} ${fromCode} = ${amount*rate} ${toCode}`;
    }
    toAmount.value = amount*rate;
}

const fromCalculate = async(fromCode, toCode, amount)=>{
    if(amount == undefined){
        amount = 1;
    }
    let rate = await getCurrency(fromCode.toLowerCase(),toCode.toLowerCase());
    fromAmount.value = amount/rate;
}


for(let code in countryList){
    dropdowns.forEach((drop)=>{
        drop.innerHTML = drop.innerHTML + `<option value=${code}>${code}</option>`;
    });
}
dropdowns[0].value = "USD";
dropdowns[1].value = "INR";

dropdowns[0].addEventListener('change',()=>{
    updateFlag(event.target,fromImage);
    fromAmount.value = 1;

    calculate(dropdowns[0].value,dropdowns[1].value);
});

dropdowns[1].addEventListener('change',()=>{
    updateFlag(event.target,toImage);
    fromAmount.value = 1;
    
    calculate(dropdowns[0].value,dropdowns[1].value);
});
submit.addEventListener('click',async ()=>{
    let fromCode = dropdowns[0].value;
    let toCode = dropdowns[1].value;
    let amount = fromAmount.value;
    console.log(fromCode,toCode,amount);
    await calculate(fromCode,toCode,amount);
})

i.addEventListener('click',()=>{
    let tempOption = dropdowns[0].value;
    dropdowns[0].value = dropdowns[1].value;
    dropdowns[1].value = tempOption;

    updateFlag(dropdowns[0],fromImage);
    updateFlag(dropdowns[1],toImage);

    fromAmount.value = 1;

    calculate(dropdowns[0].value,dropdowns[1].value);
});

fromAmount.addEventListener('input',async ()=>{
    let fromCode = dropdowns[0].value;
    let toCode = dropdowns[1].value;
    let amount = fromAmount.value;
    console.log(fromCode,toCode,amount);
    await calculate(fromCode,toCode,amount);
});

toAmount.addEventListener('input',async ()=>{
    let fromCode = dropdowns[0].value;
    let toCode = dropdowns[1].value;
    let amount = toAmount.value;
    console.log(fromCode,toCode,amount);
    await fromCalculate(fromCode,toCode,amount);
});