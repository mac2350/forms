const form=document.getElementById("regform");

const fields={
    name:document.getElementById("name"),
    email:document.getElementById("email"),
    password:document.getElementById("password"),
    confirmPassword:document.getElementById("confirm-password"),
    gender:document.getElementById("gender"),
    dob:document.getElementById("dob"),
    country:document.getElementById("country"),
    phone:document.getElementById("phone"),
    bio:document.getElementById("bio")
};



const errorElements={
    name:document.getElementById("nameError"),
    email:document.getElementById("emailError"),
    password:document.getElementById("passwordError"),
    confirmPassword:document.getElementById("confirmError"),
    gender:document.getElementById("genderError"),
    dob:document.getElementById("dobError"),
    country:document.getElementById("countryError"),
    phone:document.getElementById("phoneError"),
    bio:document.getElementById("bioError"),
};

const successMsg=document.getElementById("successMsg");
const memberlist=document.getElementById("memeberlist");
const memebercounter=document.getElementById("counter");
const darkmode=document.getElementById("theme");

console.log("Form:",form);
console.log("Fields:",fields);
console.log("Error:",errorElements);
console.log("success:",successMsg);
console.log("member List:",memberlist);
console.log("memeber counter:",memebercounter);
console.log("Darkmode:",darkmode);

if(!form || 
    !successMsg||
    !memberlist||
    !memebercounter||
    !darkmode||
    Object.values(fields).some(field=>!field)||
    Object.values(errorElements).some(error=> !error)
)
{
    throw new Error("html elements are missing");
}

function showError(fieldName, message){
    errorElements[fieldName].textContent=message;
    fields[fieldName].classList.add("invalid");
    fields[fieldName].setAttribute("aria-invalid", "true");
}

function clearError(fieldName){
    errorElements[fieldName].textContent="";
    fields[fieldName].classList.remove("invalid");
    fields[fieldName].removeAttribute("aria-invalid");
}

function clearALLErrors(){
    Object.keys(fields).forEach(fieldName=>{
        clearError(fieldName);
    });
}

function validateField(fieldName){
    const value =fields[fieldName].value.trim();
    clearError(fieldName);

    switch(fieldName){
        case "name":
            if (!value){
                showError("name","full name");
            }else if(value.length<2){
                showError("name","Name must have at least 2 characters");
            }else if(value.length>100){
                showError("name","must not pass 100 characters");
            }else{
                return true;
            }
            break;
        case "email":{
            const emailpattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!value){
                showError("email","email is required");
            }else if(!emailpattern.test(value)){
                showError("email","enter correct email");
            }else{
                return true;
            }
            break;


        }
        case "password":
            if (!fields.password.value) {
                showError("password", "Password is required.");
            } else if (fields.password.value.length < 8) {
                showError("password", "Password must be at least 8 characters.");
            } else {
                return true;
            }
            break;
        
        case "confirmPassword":
            if(!fields.confirmPassword.value){
                showError("confirmPassword","cornfirm");
            }else if(fields.confirmPassword.value!==fields.password.value){
                showError("confirmPassword","dont match");
            }else{
                return true;
            }
            break;
        
        case "gender":
            if(!value){
                showError("gender","select a gender");
            }else {
                return true;
            }
            break;
        case "dob":{
            if(!value){
                showError("dob","dob requried")
            }else{
                const birth= new Date(value + "T00:00:00");
                const today=new Date();
                today.setHours(0,0,0,0);

                if(Number.isNaN(birth.getTime())|| birth>today)
                {
                    showError("dob", "birth cant be in the future");
                }else{
                    return true;
                }
            }
            break;

        }
        case "country":
            if (!value) {
                showError("country", "Country is required.");
            } else if (value.length < 2) {
                showError("country", "Enter a valid country name.");
            } else {
                return true;
            }
            break;    
        case "phone":{
            const phonePattern=/^\+?[0-9\s()-]{7,20}$/;
            const digitcount=value.replace(/\D/g, "").length;

            if(!value){
                showError("phone","phoneNo required");
            }else if(!phonePattern.test(value) ||
                digitCount < 7 ||
                digitCount > 15){
                    showError("phone","enter a valid number");
                }
                else{
                    return true;
                }
                break;
        }
        case "bio":
            if (!value) {
                showError("bio", "Bio is required.");
            } else if (value.length < 10) {
                showError("bio", "Bio must contain at least 10 characters.");
            } else if (value.length > 500) {
                showError("bio", "Bio must not exceed 500 characters.");
            } else {
                return true;
            }
            break;
    }
    return false;
}
Object.keys(fields).forEach(fieldName=>{
    const field=fields[fieldName];
    const event=field.tagName==="ELECT"?"change":"input";

    field.addEventListener(event,()=>{
        validateField(fieldName);

        if(fieldName==="password"&& field.confirmPassword.value){
            validateField("confirmPasswod");
        }
    })
});

function updateMemberCounter() {
    const members = memberlist.querySelectorAll(".member-item");

    memebercounter.textContent = members.length;

    const emptyNote = document.getElementById("emptyNote");

    if (members.length === 0) {
        if (!emptyNote) {
            const note = document.createElement("li");
            note.id = "emptyNote";
            note.className = "empty";
            note.textContent ="No members yet. Register someone to begin.";
            memberlist.appendChild(note);
        }
    } else if (emptyNote) {
        emptyNote.remove();
    }
}

function register(){
    const member={
        name:fields.name.value.trim(),
        email:fields.email.value.trim(),
        gender:fields.gender.value.trim(),
        dob:fields.dob.value.trim(),
        country:fields.country.value.trim(),
        phone:fields.phone.value.trim(),
        bio:fields.bio.value.trim(),
    };

    const list=document.createElement("li");
    list.className="memeber-items";

    const info=document.createElement("div");
    info.className="info";

    const memberName=document.createElement("strong");
    memberName.textContent=member.name;

    const memberEmail=document.createElement("span");
    memberEmail.textContent=member.email;

    const memberCountry=document.createElement("span");
    memberCountry.textContent= ` • ${member.country}`;

    const removeButton=document.createElement("button");
    removeButton.type="button";
    removeButton.className="remove";
    removeButton.textContent="Remove";
    removeButton.setAttribute=(
        "aria-label",
        `Remove ${member.name}`
    );

    info.appendChild(memberName);
    info.appendChild(document.createElement("br"));
    info.appendChild(memberEmail);
    info.appendChild(document.createElement("br"));
    info.appendChild(memberCountry);

    list.appendChild(info);
    list.appendChild(removeButton);

    removeButton.addEventListener("click", ()=>{
        const confirmed=window.confirm(
            `Remove ${member.name} from the member list?`
        );

        if(confirmed){
            list.remove();
            updateMemberCounter();
        }
    });

    memberlist.appendChild(list);
    updateMemberCounter();

    successMsg.textContent= `${member.name} has been registered successfully!`;
    successMsg.classList.remove("hidden");
}
////
form.addEventListener("submit", event=>{
    event.preventDefault();
    let formIsValid=true;

    Object.keys(fields).forEach(fieldName=>{
        const fieldIsValid= validateField(fieldName);
        if (!fieldIsValid){
            formIsValid=false;
        }
    });
    

    if(!formIsValid){
        successMsg.classList.add("hidden");
        const firstInvalidFIeld=form.querySelector(".invalid");
        if(firstInvalidFIeld) firstInvalidFIeld.focus();
        return;
    }

    registerMember();
    form.reset();
    clearALLErrors();
});

const Theme_key="webdev-theme";

function applytheme(isDark){
    document.body.classList.toggle("dark",isDark);
    darkmode.textContent=isDark ? "light Mode": "Dark Mode";
    darkmode.setAttribute("aria-pressed",String(isDark));
}

const savedTheme=localStorage.getItem(Theme_key);
const prefersDark=window.matchMedia("(prefer: dark)").matches;
applytheme(savedTheme!==null ? savedTheme=="dark": prefersDark);

darkmode.addEventListener("click", ()=>{
    const darkModeActive=document.body.classList.toggle("dark");
    applytheme(isDark);
    localStorage.setItem(Theme_key,isDark ? "dark" : "light");
});
    

updateMemberCounter();

console.log("Web registration system is ready");