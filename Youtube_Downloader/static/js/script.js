// ==========================
// ELEMENTS
// ==========================

const input = document.getElementById("url");
const format = document.getElementById("format");
const button = document.getElementById("download");

// ==========================
// EVENTS
// ==========================

button.addEventListener("click", analyzeVideo);

input.addEventListener("keypress", function(event){

    if(event.key === "Enter"){

        analyzeVideo();

    }

});

// ==========================
// MAIN FUNCTION
// ==========================

async function analyzeVideo(){

    const url = input.value.trim();
    const type = format.value;

    if(url === ""){

        alert("Please paste a YouTube URL.");
        return;

    }

    if(!isYoutubeURL(url)){

        alert("Invalid YouTube URL.");
        return;

    }

    button.textContent = "Downloading...";
    button.disabled = true;

    try{

        const response = await fetch("http://127.0.0.1:5000/download",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                url:url,
                type:type

            })

        });

        if(!response.ok){

            throw new Error();

        }

        // Recebe o arquivo
        const blob = await response.blob();

        // Cria URL temporária
        const downloadURL = window.URL.createObjectURL(blob);

        // Nome sugerido
        const disposition = response.headers.get("Content-Disposition");

        let filename = "download";

        if(disposition){

            const match = disposition.match(/filename="?(.+)"?/);

            if(match){

                filename = match[1];

            }

        }

        // Inicia download
        const a = document.createElement("a");

        a.href = downloadURL;
        a.download = filename;

        document.body.appendChild(a);

        a.click();

        a.remove();

        window.URL.revokeObjectURL(downloadURL);

    }

    catch(error){

        console.error(error);

        alert("Download failed.");

    }

    finally{

        button.textContent = "Download";
        button.disabled = false;

    }

}

// ==========================
// URL VALIDATION
// ==========================

function isYoutubeURL(url){

    return url.includes("youtube.com") ||
           url.includes("youtu.be");

}