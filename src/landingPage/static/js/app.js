// attendre que la page se charge entièremment
window.addEventListener("DOMContentLoaded", (event) => {

    $("#answer-text").text("");

    var csrf = $("input[name=csrfmiddlewaretoken]").val();

    // Récupérez le form
    const questionForm = document.getElementById("question-form");


    // Récupérez la vidéo
    const video = document.getElementById("video-avatar");


    questionForm.addEventListener("submit", (event) => {
        // Empêcher le comportement de soumission par défaut du formulaire
        event.preventDefault();

        // Récupérer la valeur de l'input question
        const questionInput = document.getElementById("inputField");
        const question = questionInput.value;

        // Afficher la question dans la console
        console.log("Question posée : ", question);


        $.ajax({
            url: '/landingPage/get_answer/',
            type: 'POST',
            data: {
                question: question,
                csrfmiddlewaretoken: csrf
            },
            success: function (data) {
                // Afficher la réponse de l'API Hugging Face
                console.log(data.answer)
                const text = data.answer;
                const mots = text.split(" ");

                let i = 0;
                video.play();
                const interval = setInterval(() => {
                    document.getElementById("answer-text").textContent += mots[i] + " ";
                    i++;
                    if (i > mots.length) {
                        clearInterval(interval);
                        video.pause();
                        video.currentTime = 0; // Remet la vidéo à zéro
                    }
                }, 100); // Délai en millisecondes entre chaque mot

                video.addEventListener("ended", () => {
                    if (i < mots.length) {
                        video.loop = true;
                        video.currentTime = 0;
                        video.play();
                    }
                });

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });

    });


});



