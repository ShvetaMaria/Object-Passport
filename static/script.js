// ==========================================
// OBJECT PASSPORT
// Frontend + Gemini AI
// ==========================================

// Get HTML elements

const imageInput = document.getElementById("imageInput");
const chooseBtn = document.getElementById("chooseBtn");
const generateBtn = document.getElementById("generateBtn");
const cameraBtn = document.getElementById("cameraBtn");
const fileName = document.getElementById("fileName");

const cameraModal = document.getElementById("cameraModal");
const cameraVideo = document.getElementById("cameraVideo");
const cameraCanvas = document.getElementById("cameraCanvas");
const captureBtn = document.getElementById("captureBtn");
const closeCameraBtn = document.getElementById("closeCameraBtn");

let cameraStream = null;

const previewContainer =
    document.getElementById("previewContainer");

const previewImage =
    document.getElementById("previewImage");

const loading =
    document.getElementById("loading");

const passportSection =
    document.getElementById("passportSection");

const deathCertificate =
    document.getElementById("deathCertificate");

const deathBtn =
    document.getElementById("deathBtn");

const againBtn =
    document.getElementById("againBtn");


// Store selected image
let selectedImage = null;
let currentPassport = null;


// ==========================================
// CHOOSE IMAGE
// ==========================================

chooseBtn.addEventListener("click", function () {
    imageInput.click();
});

cameraBtn.addEventListener("click", async function () {

    try {

        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment"
            },
            audio: false
        });

        cameraVideo.srcObject = cameraStream;

        cameraModal.classList.remove("hidden");

    } catch (error) {

        console.error("Camera error:", error);

        alert(
            "Unable to access the camera.\n\n" +
            "Please allow camera permission and try again."
        );

    }

});

captureBtn.addEventListener("click", function () {

    const width = cameraVideo.videoWidth;
    const height = cameraVideo.videoHeight;

    cameraCanvas.width = width;
    cameraCanvas.height = height;

    const context = cameraCanvas.getContext("2d");

    context.drawImage(
        cameraVideo,
        0,
        0,
        width,
        height
    );

    cameraCanvas.toBlob(function (blob) {

        selectedImage = new File(
            [blob],
            "camera-object.jpg",
            {
                type: "image/jpeg"
            }
        );

        fileName.textContent = "Selected: camera-object.jpg";

        generateBtn.disabled = false;

        previewImage.src =
            URL.createObjectURL(selectedImage);

        previewContainer.classList.remove("hidden");

        closeCamera();

    }, "image/jpeg");

});

closeCameraBtn.addEventListener("click", function () {
    closeCamera();
});

function closeCamera() {

    if (cameraStream) {

        cameraStream.getTracks().forEach(function (track) {
            track.stop();
        });

        cameraStream = null;
    }

    cameraVideo.srcObject = null;

    cameraModal.classList.add("hidden");
}


// ==========================================
// IMAGE SELECTED
// ==========================================

imageInput.addEventListener("change", function () {

    const file = imageInput.files[0];

    if (!file) {
        return;
    }

    selectedImage = file;

    // Show file name
    fileName.textContent =
        "Selected: " + file.name;

    // Enable Generate button
    generateBtn.disabled = false;

    // Show image preview
    const reader = new FileReader();

    reader.onload = function (event) {

        previewImage.src =
            event.target.result;

        previewContainer.classList.remove("hidden");
    };

    reader.readAsDataURL(file);
});


// ==========================================
// GENERATE PASSPORT - REAL GEMINI AI
// ==========================================

async function generatePassport() {

    if (!selectedImage) {

        alert("Please choose an object first!");

        return;
    }

    // Disable button
    generateBtn.disabled = true;

    // Show loading screen
    loading.classList.remove("hidden");

    // Create FormData
    const formData = new FormData();

    // Add image to FormData
    formData.append("image", selectedImage);

    try {

        // Send image to Flask backend
        const response = await fetch("/generate-passport", {

            method: "POST",

            body: formData
        });


        // Convert Flask response to JSON
        const data = await response.json();


        // Check if Flask returned an error
        if (!response.ok) {

            throw new Error(
                data.error || "Something went wrong."
            );
        }


        // Save AI-generated passport
        currentPassport = data;


        // Display passport
        displayPassport(data);


    } catch (error) {

        console.error("ERROR:", error);


        alert(
    "🚨 IMMIGRATION OFFICE OVERLOAD 🚨\n\n" +
    "Our object immigration officers are currently overwhelmed.\n\n" +
    "The AI passport system has temporarily run out of processing quota.\n\n" +
    "Please try again later. Your object has not been rejected. 😭🪪"
    );


        // Allow user to try again
        generateBtn.disabled = false;


    } finally {

        // Hide loading screen
        loading.classList.add("hidden");
    }
}


// Connect Generate button to function
generateBtn.addEventListener(
    "click",
    generatePassport
);


// ==========================================
// DISPLAY PASSPORT
// ==========================================

function displayPassport(data) {

    passportSection.classList.remove("hidden");


    // Image
    document.getElementById("passportImage").src =
        previewImage.src;


    // Basic information
    document.getElementById("objectName").textContent =
        data.object_name;

    document.getElementById("nationality").textContent =
        data.nationality;

    document.getElementById("age").textContent =
        data.age;

    document.getElementById("occupation").textContent =
        data.occupation;

    document.getElementById("passportNumber").textContent =
        data.passport_number;

    document.getElementById("immigrationStatus").textContent =
        data.immigration_status;


    // Extra information
    document.getElementById("personality").textContent =
        data.personality;

    document.getElementById("criminalRecord").textContent =
        data.criminal_record;

    document.getElementById("favouriteActivity").textContent =
        data.favourite_activity;

    document.getElementById("healthStatus").textContent =
        data.health_status;

    document.getElementById("lifeStory").textContent =
        data.life_story;

    document.getElementById("lifespan").textContent =
        data.estimated_lifespan;

    document.getElementById("status").textContent =
        data.status;


    // ======================================
    // TRAVEL HISTORY
    // ======================================

    const travelHistory =
        document.getElementById("travelHistory");

    travelHistory.innerHTML = "";


    data.travel_history.forEach(function (place) {

        const li = document.createElement("li");

        li.textContent = place;

        travelHistory.appendChild(li);
    });


    // Scroll down to passport
    passportSection.scrollIntoView({
        behavior: "smooth"
    });
}


// ==========================================
// DEATH CERTIFICATE 💀
// ==========================================

function killObject() {

    if (!currentPassport) {
        return;
    }


    const causes = [

        "Abandoned inside a college bag for 47 days.",

        "Fell off a table with catastrophic consequences.",

        "Was left inside a hot car.",

        "Consumed by the mysterious black hole known as Lost & Found.",

        "Accidentally stepped on.",

        "Reached the natural end of its unnecessarily dramatic life."

    ];


    const lastWords = [

        "I was still useful...",

        "Tell my owner I forgive them.",

        "One last refill...",

        "I knew this day would come.",

        "Please recycle me.",

        "It was a good life."

    ];


    // Object name
    document.getElementById("deadObjectName").textContent =
        currentPassport.object_name;


    // Random cause of death
    document.getElementById("causeOfDeath").textContent =
        causes[
            Math.floor(Math.random() * causes.length)
        ];


    // Age
    document.getElementById("deathAge").textContent =
        currentPassport.age;


    // Random last words
    document.getElementById("lastWords").textContent =
        lastWords[
            Math.floor(Math.random() * lastWords.length)
        ];


    // Show death certificate
    deathCertificate.classList.remove("hidden");


    // Scroll to it
    deathCertificate.scrollIntoView({
        behavior: "smooth"
    });
}


// Connect Death Certificate button
deathBtn.addEventListener(
    "click",
    killObject
);


// ==========================================
// PASSPORT ANOTHER OBJECT
// ==========================================

againBtn.addEventListener("click", function () {

    location.reload();

});

// ==========================================
// 🌌 MILKY WAY FLOATING PARTICLES
// ==========================================

const galaxy = document.querySelector(".galaxy-stars");

if (galaxy) {

    // Number of visible particles
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {

        const particle = document.createElement("div");

        particle.classList.add("galaxy-particle");

        // Random position across the screen
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * 100 + "%";


        // Random gentle movement
        const moveX = (Math.random() - 0.5) * 70;
        const moveY = (Math.random() - 0.5) * 50;

        particle.style.setProperty(
            "--move-x",
            moveX + "px"
        );

        particle.style.setProperty(
            "--move-y",
            moveY + "px"
        );


        // Random animation speeds
        const duration = 10 + Math.random() * 15;
        const shine = 3 + Math.random() * 6;

        particle.style.setProperty(
            "--duration",
            duration + "s"
        );

        particle.style.setProperty(
            "--shine",
            shine + "s"
        );


        // Start at different points in animation
        particle.style.animationDelay =
            "-" + Math.random() * 12 + "s";


        // Mostly normal white particles
        const type = Math.random();

        if (type < 0.10) {

            // 10% golden
            particle.classList.add("gold");

        } else if (type < 0.35) {

            // 25% tiny
            particle.classList.add("small");

        } else if (type < 0.43) {

            // 8% bright
            particle.classList.add("bright");
        }


        galaxy.appendChild(particle);
    }
}